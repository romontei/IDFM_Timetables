#!/bin/bash

# Vérification des paramètres
if [ "$#" -ne 4 ]; then
  echo "Usage: $0 <fichier_csv> <type> <dossier_source> <dossier_destination>"
  exit 1
fi

CSV_FILE="$1"
TYPE="$2"
SRC_DIR="$3"
DST_DIR="$4"

if [ ! -f "$CSV_FILE" ]; then
  echo "Erreur : fichier CSV introuvable."
  exit 1
fi

if [ ! -d "$SRC_DIR" ]; then
  echo "Erreur : dossier source introuvable."
  exit 1
fi

mkdir -p "$DST_DIR"

# Lecture du CSV et traitement ligne par ligne
tail -n +2 "$CSV_FILE" | awk -F ';' -v type="$TYPE" '$4 == type { print $2 ";" $1 }' | while IFS=';' read -r name_line id_line; do
  for file in "$SRC_DIR"/*; do
    filename=$(basename "$file")
    basename_no_ext="${filename%.*}"
    extension="${filename##*.}"

    if [ "$basename_no_ext" == "$name_line" ]; then
      cp "$file" "$DST_DIR/${id_line}.${extension}"
      echo "Copié : $filename -> ${id_line}.${extension}"
    fi
  done
done