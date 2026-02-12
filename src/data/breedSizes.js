// Breed-to-size mapping. Size affects life stage timing.
// small: <25 lbs, medium: 25-50, large: 50-90, giant: 90+

const BREED_SIZES = {
  // Small
  "Chihuahua": "small", "Yorkshire Terrier": "small", "Pomeranian": "small",
  "Maltese": "small", "Shih Tzu": "small", "Toy Poodle": "small",
  "Miniature Poodle": "small", "Dachshund": "small", "Miniature Dachshund": "small",
  "Papillon": "small", "Havanese": "small", "Bichon Frise": "small",
  "Cavalier King Charles Spaniel": "small", "Miniature Schnauzer": "small",
  "Pug": "small", "French Bulldog": "small", "Boston Terrier": "small",
  "Jack Russell Terrier": "small", "West Highland White Terrier": "small",
  "Lhasa Apso": "small", "Pekingese": "small", "Italian Greyhound": "small",
  "Brussels Griffon": "small", "Affenpinscher": "small", "Chinese Crested": "small",
  "Toy Fox Terrier": "small", "Silky Terrier": "small", "Norfolk Terrier": "small",
  "Norwich Terrier": "small", "Scottish Terrier": "small", "Cairn Terrier": "small",
  "Miniature Pinscher": "small", "Coton de Tulear": "small",

  // Medium
  "Beagle": "medium", "Cocker Spaniel": "medium", "English Springer Spaniel": "medium",
  "Border Collie": "medium", "Australian Shepherd": "medium",
  "Shetland Sheepdog": "medium", "Brittany": "medium", "Whippet": "medium",
  "Basenji": "medium", "Staffordshire Bull Terrier": "medium",
  "American Staffordshire Terrier": "medium", "Bull Terrier": "medium",
  "Standard Poodle": "medium", "Corgi": "medium",
  "Pembroke Welsh Corgi": "medium", "Cardigan Welsh Corgi": "medium",
  "Australian Cattle Dog": "medium", "English Bulldog": "medium",
  "Bulldog": "medium", "Basset Hound": "medium", "Dalmatian": "medium",
  "Vizsla": "medium", "Weimaraner": "medium", "Portuguese Water Dog": "medium",
  "Samoyed": "medium", "Keeshond": "medium", "Finnish Spitz": "medium",
  "American Pit Bull Terrier": "medium", "Pit Bull": "medium",

  // Large
  "Labrador Retriever": "large", "Labrador": "large",
  "Golden Retriever": "large", "German Shepherd": "large",
  "Rottweiler": "large", "Doberman Pinscher": "large", "Doberman": "large",
  "Boxer": "large", "Siberian Husky": "large", "Husky": "large",
  "Alaskan Malamute": "large", "Belgian Malinois": "large",
  "Rhodesian Ridgeback": "large", "German Shorthaired Pointer": "large",
  "Chesapeake Bay Retriever": "large", "Flat-Coated Retriever": "large",
  "Irish Setter": "large", "Gordon Setter": "large",
  "Airedale Terrier": "large", "Collie": "large",
  "Old English Sheepdog": "large", "Akita": "large",
  "Bernese Mountain Dog": "large", "Cane Corso": "large",
  "Bouvier des Flandres": "large", "Giant Schnauzer": "large",

  // Giant
  "Great Dane": "giant", "Saint Bernard": "giant", "Mastiff": "giant",
  "English Mastiff": "giant", "Bullmastiff": "giant", "Newfoundland": "giant",
  "Irish Wolfhound": "giant", "Scottish Deerhound": "giant",
  "Great Pyrenees": "giant", "Leonberger": "giant", "Tibetan Mastiff": "giant",
  "Anatolian Shepherd": "giant", "Neapolitan Mastiff": "giant",
  "Dogue de Bordeaux": "giant", "Komondor": "giant", "Kuvasz": "giant",
};

export function getBreedSize(breed) {
  if (!breed) return "medium";
  // Exact match
  if (BREED_SIZES[breed]) return BREED_SIZES[breed];
  // Partial match (for "Golden Retriever Mix" etc.)
  const lower = breed.toLowerCase();
  for (const [name, size] of Object.entries(BREED_SIZES)) {
    if (lower.includes(name.toLowerCase()) || name.toLowerCase().includes(lower)) {
      return size;
    }
  }
  // Mix defaults
  if (lower.includes("mix")) return "medium";
  return "medium";
}

export { BREED_SIZES };
