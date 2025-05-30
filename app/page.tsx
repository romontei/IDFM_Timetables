'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import styles from './page.module.css';
import dotenv from 'dotenv';


interface LineRef {
  value: string;
}

interface DestinationRef {
  value: string;
}

interface MonitoredCall {
  ExpectedArrivalTime?: string;
  ExpectedDepartureTime?: string;
  VehiculeAtStop?: boolean;
}

interface MonitoredVehicleJourney {
  LineRef: LineRef;
  DestinationRef?: DestinationRef;
  DestinationName?: Array<{ value: string }>;
  DirectionName?: Array<{ value: string }>;
  MonitoredCall?: MonitoredCall;
}

interface MonitoredStopVisit {
  RecordedAtTime: string;
  ItemIdentifier: string;
  MonitoringRef: { value: string };
  MonitoredVehicleJourney: MonitoredVehicleJourney;
}

interface StopMonitoringDelivery {
  MonitoredStopVisit: MonitoredStopVisit[];
}

interface ServiceDelivery {
  StopMonitoringDelivery: StopMonitoringDelivery[];
}

interface SiriResponse {
  Siri: {
    ServiceDelivery: ServiceDelivery;
  };
}

dotenv.config();

// Créez une instance Axios avec une configuration par défaut
const api = axios.create({
  baseURL: 'https://prim.iledefrance-mobilites.fr/marketplace/stop-monitoring', // URL de l'API IDFM
  headers: {
    'Accept': 'application/json',
    'apiKey': process.env.NEXT_PUBLIC_API_KEY, // Remplacez par votre clé API réelle
  },
});

const calculateMinutesRemaining = (dateString: string | undefined, atStop: boolean | undefined) => {
  if (!dateString) return 'N/A';

  const arrivalTime = new Date(dateString).getTime();
  const currentTime = new Date().getTime();
  const differenceInMilliseconds = arrivalTime - currentTime;

  if (atStop || differenceInMilliseconds < 0) {
    return 'À quai';
  }

  const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
  return `${differenceInMinutes}`;
};

const extractCode = (inputString: string): string => {
  const regex = /STIF:Line::([A-Za-z0-9]+):?/;
  const match = inputString.match(regex);

  return match ? match[1] : '';
}


const Home = () => {
  // const [stationRef, setStationRef] = useState<string>('STIF:StopPoint:Q:473921:');
  const [stationRef, setStationRef] = useState<string>('STIF:StopArea:SP:474151:');
  const [schedules, setSchedules] = useState<MonitoredStopVisit[]>([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get<SiriResponse>('', {
          params: {
            MonitoringRef: stationRef,
          },
        });

        console.log('API Response:', response.data);

        const schedulesData = response.data.Siri?.ServiceDelivery?.StopMonitoringDelivery?.[0]?.MonitoredStopVisit || [];
        console.log('Schedules Data:', schedulesData);

        setSchedules(schedulesData);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchSchedules();
    const interval = setInterval(fetchSchedules, 60000); // Rafraîchir toutes les minutes

    return () => clearInterval(interval);
  }, [stationRef]);

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <h1 className={styles.title}>Horaires de Métro</h1>
        <input
          type="text"
          onChange={(e) => setStationRef(e.target.value)}
          value={stationRef}
          placeholder="Entrez une référence de station"
          className={styles.input}
        />
      </div>


      <ul className={styles.list}>
        {schedules.length > 0 ? (
          schedules.map((schedule, index) => {
            const lineCode = extractCode(schedule.MonitoredVehicleJourney.LineRef?.value || '');
            const imagePath = `/images/${lineCode}.svg`;

            const time = schedule.MonitoredVehicleJourney.MonitoredCall?.ExpectedArrivalTime || schedule.MonitoredVehicleJourney.MonitoredCall?.ExpectedDepartureTime;

            return (
              <li key={index} className={styles.item}>
                <div className={styles.imageContainer}>
                  <Image
                    src={imagePath}
                    alt={`Line ${lineCode}`}
                    width={80}
                    height={80}
                    className={styles.image}
                  />
                </div>
                <div className={styles.journeyContainer}>
                  <div className={styles.destinationContainer}>
                    {schedule.MonitoredVehicleJourney.DestinationName?.[0].value}
                  </div>
                  <p>Direction: {schedule.MonitoredVehicleJourney.DirectionName?.[0]?.value}</p>
                </div>
                <div className={styles.arrivalWrapper}>
                  <div className={styles.arrivalContainer}>
                    <span className={styles.arrivalTime}>
                      {calculateMinutesRemaining(
                        time,
                        schedule.MonitoredVehicleJourney.MonitoredCall?.VehiculeAtStop
                      )}
                    </span>
                  </div>
                </div>
              </li>
            )
          })
        ) : (
          <p>Aucun horaire disponible</p>
        )}
      </ul>
    </div>
  );
};

export default Home;