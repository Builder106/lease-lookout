#!/usr/bin/env bash
# Fetch public sample leases for testing (Tier 1: mostly-legal templates).
# These are third-party documents, so we DON'T commit them (see .gitignore) —
# this script pulls them on demand into tests/fixtures/sample_leases/.
#
#   bash scripts/fetch_sample_leases.sh
set -u

DEST="$(cd "$(dirname "$0")/.." && pwd)/tests/fixtures/sample_leases"
mkdir -p "$DEST"

# name|url  — a diverse mix: CT-specific, university off-campus (.edu), and general.
leases=(
  "ct-association-of-realtors|https://eforms.com/images/2015/10/connecticut-association-of-realtors-lease-agreement.pdf"
  "ct-leaserunner|https://www.leaserunner.com/assets/public/pdf/sample-lease-agreement-connecticut.pdf"
  "ftc-consumer-gov|https://www.consumer.gov/sites/www.consumer.gov/files/articles/pdf/pdf-1050g-sample_rental_agreement_basic_beginning_renting_an_apartment_or_house.pdf"
  "edu-puget-sound-offcampus|https://www.pugetsound.edu/sites/default/files/file/1873_OCSSsamplelease_0.pdf"
  "edu-uri|https://web.uri.edu/wp-content/uploads/sites/1078/lease.pdf"
  "edu-berkeley|https://housing.berkeley.edu/wp-content/uploads/Sample_Rental-Agreement.pdf"
  "edu-pitt-pa-standard|https://www.payab.pitt.edu/files/ApartmentFinder101/PennsylvaniaStandardResidentialLeaseAgreement.pdf"
  "esign-1page|https://esign.com/wp-content/uploads/Simple-1-Page-Residential-Lease-Agreement.pdf"
)

ok=0; fail=0
for entry in "${leases[@]}"; do
  name="${entry%%|*}"; url="${entry#*|}"
  out="$DEST/$name.pdf"
  if curl -sSL -A "Mozilla/5.0" --max-time 60 "$url" -o "$out" 2>/dev/null \
     && [ "$(file -b --mime-type "$out" 2>/dev/null)" = "application/pdf" ]; then
    printf "  ok    %-30s %s bytes\n" "$name" "$(wc -c <"$out" | tr -d ' ')"; ok=$((ok+1))
  else
    printf "  FAIL  %-30s %s\n" "$name" "$url"; rm -f "$out" 2>/dev/null; fail=$((fail+1))
  fi
done
echo "Fetched $ok lease(s) into tests/fixtures/sample_leases/ ($fail failed)."
echo "These are mostly LEGAL templates — good for false-positive checks. To test"
echo "that rules FIRE, use the synthetic kitchen-sink fixture or real (redacted) leases."
