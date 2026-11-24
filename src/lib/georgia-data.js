export const CATEGORIES = [
  "Meals & Nutrition",
  "Healthcare & Medicare",
  "Caregiver & Respite",
  "Housing & Utilities",
  "Transportation",
  "Legal & Elder Protection",
  "Senior Centers",
  "Start Here & Help Lines",
];

export const CATEGORY_BLURBS = {
  "Meals & Nutrition": "Groceries, food boxes, home-delivered and group meals",
  "Healthcare & Medicare": "Medicare counseling, Medicaid waivers, PACE",
  "Caregiver & Respite": "Respite care, training, dementia support",
  "Housing & Utilities": "Rent help, energy bills, home repair, tax relief",
  Transportation: "Medical rides, paratransit, senior shuttles",
  "Legal & Elder Protection": "Free legal aid, abuse reporting, ombudsman",
  "Senior Centers": "Meals, activities, local case management",
  "Start Here & Help Lines": "Statewide intake, referral, and crisis lines",
};

export const COST_TYPES = ["Free", "Sliding scale", "Income-based", "Medicaid", "Varies"];

export const NEEDS = [
  { id: "food", label: "Food and groceries", category: "Meals & Nutrition", icon: "UtensilsCrossed" },
  { id: "bills", label: "Housing, rent, or utility bills", category: "Housing & Utilities", icon: "Home" },
  { id: "rides", label: "Getting to appointments", category: "Transportation", icon: "Bus" },
  { id: "homecare", label: "Care at home or caregiver help", category: "Caregiver & Respite", icon: "HeartHandshake" },
  { id: "health", label: "Medicare, Medicaid, or health coverage", category: "Healthcare & Medicare", icon: "HeartPulse" },
  { id: "legal", label: "Legal help or safety concerns", category: "Legal & Elder Protection", icon: "Scale" },
  { id: "social", label: "Company, activities, or a senior center", category: "Senior Centers", icon: "Users" },
];

export const COUNTIES = [
  "Appling", "Atkinson", "Bacon", "Baker", "Baldwin", "Banks", "Barrow", "Bartow", "Ben Hill", "Berrien",
  "Bibb", "Bleckley", "Brantley", "Brooks", "Bryan", "Bulloch", "Burke", "Butts", "Calhoun", "Camden",
  "Candler", "Carroll", "Catoosa", "Charlton", "Chatham", "Chattahoochee", "Chattooga", "Cherokee", "Clarke", "Clay",
  "Clayton", "Clinch", "Cobb", "Coffee", "Colquitt", "Columbia", "Cook", "Coweta", "Crawford", "Crisp",
  "Dade", "Dawson", "Decatur", "DeKalb", "Dodge", "Dooly", "Dougherty", "Douglas", "Early", "Echols",
  "Effingham", "Elbert", "Emanuel", "Evans", "Fannin", "Fayette", "Floyd", "Forsyth", "Franklin", "Fulton",
  "Gilmer", "Glascock", "Glynn", "Gordon", "Grady", "Greene", "Gwinnett", "Habersham", "Hall", "Hancock",
  "Haralson", "Harris", "Hart", "Heard", "Henry", "Houston", "Irwin", "Jackson", "Jasper", "Jeff Davis",
  "Jefferson", "Jenkins", "Johnson", "Jones", "Lamar", "Lanier", "Laurens", "Lee", "Liberty", "Lincoln",
  "Long", "Lowndes", "Lumpkin", "Macon", "Madison", "Marion", "McDuffie", "McIntosh", "Meriwether", "Miller",
  "Mitchell", "Monroe", "Montgomery", "Morgan", "Murray", "Muscogee", "Newton", "Oconee", "Oglethorpe", "Paulding",
  "Peach", "Pickens", "Pierce", "Pike", "Polk", "Pulaski", "Putnam", "Quitman", "Rabun", "Randolph",
  "Richmond", "Rockdale", "Schley", "Screven", "Seminole", "Spalding", "Stephens", "Stewart", "Sumter", "Talbot",
  "Taliaferro", "Tattnall", "Taylor", "Telfair", "Terrell", "Thomas", "Tift", "Toombs", "Towns", "Treutlen",
  "Troup", "Turner", "Twiggs", "Union", "Upson", "Walker", "Walton", "Ware", "Warren", "Washington",
  "Wayne", "Webster", "Wheeler", "White", "Whitfield", "Wilcox", "Wilkes", "Wilkinson", "Worth",
];

export const AAAS = [
  {
    id: "arc",
    name: "Atlanta Regional Commission — Empowerline",
    short: "Metro Atlanta",
    phone: "(404) 463-3333",
    website: "https://empowerline.org/",
    counties: ["Cherokee", "Clayton", "Cobb", "DeKalb", "Douglas", "Fayette", "Fulton", "Gwinnett", "Henry", "Rockdale"],
  },
  {
    id: "negrc",
    name: "Northeast Georgia Regional Commission",
    short: "Northeast Georgia",
    phone: "(706) 369-5650",
    website: "https://negrc.org/aging/",
    counties: ["Barrow", "Clarke", "Elbert", "Greene", "Jackson", "Jasper", "Madison", "Morgan", "Newton", "Oconee", "Oglethorpe", "Walton"],
  },
  {
    id: "nwgrc",
    name: "Northwest Georgia Regional Commission",
    short: "Northwest Georgia",
    phone: "(706) 295-6485",
    website: "https://www.nwgrc.org/",
    counties: ["Bartow", "Catoosa", "Chattooga", "Dade", "Floyd", "Gordon", "Haralson", "Murray", "Paulding", "Polk", "Walker", "Whitfield"],
  },
  {
    id: "gmrc",
    name: "Georgia Mountains Regional Commission",
    short: "Georgia Mountains",
    phone: "(770) 538-2650",
    website: "https://www.gmrc.ga.gov/",
    counties: ["Banks", "Dawson", "Fannin", "Forsyth", "Franklin", "Gilmer", "Habersham", "Hall", "Hart", "Lumpkin", "Pickens", "Rabun", "Stephens", "Towns", "Union", "White"],
  },
  {
    id: "threerivers",
    name: "Three Rivers Regional Commission",
    short: "Three Rivers",
    phone: "(678) 692-0510",
    website: "https://threeriversrc.com/",
    counties: ["Butts", "Carroll", "Coweta", "Heard", "Lamar", "Meriwether", "Pike", "Spalding", "Troup", "Upson"],
  },
  {
    id: "middlegeorgia",
    name: "Middle Georgia Regional Commission",
    short: "Middle Georgia",
    phone: "(478) 751-6160",
    website: "https://www.middlegeorgiarc.org/",
    counties: ["Baldwin", "Bibb", "Bleckley", "Crawford", "Hancock", "Houston", "Jasper", "Jones", "Monroe", "Peach", "Pulaski", "Putnam", "Twiggs", "Washington", "Wilkinson"],
  },
  {
    id: "csra",
    name: "Central Savannah River Area Regional Commission",
    short: "CSRA (Augusta area)",
    phone: "(706) 210-2000",
    website: "https://www.csrarc.ga.gov/",
    counties: ["Burke", "Columbia", "Glascock", "Jefferson", "Jenkins", "Lincoln", "McDuffie", "Richmond", "Taliaferro", "Warren", "Wilkes"],
  },
  {
    id: "hoga",
    name: "Heart of Georgia Altamaha Regional Commission",
    short: "Heart of Georgia Altamaha",
    phone: "(912) 367-3648",
    website: "https://www.hogarc.org/",
    counties: ["Appling", "Candler", "Dodge", "Emanuel", "Evans", "Jeff Davis", "Johnson", "Laurens", "Montgomery", "Tattnall", "Telfair", "Toombs", "Treutlen", "Wayne", "Wheeler"],
  },
  {
    id: "sgrc",
    name: "Southern Georgia Regional Commission",
    short: "South Georgia",
    phone: "(229) 333-5277",
    website: "https://www.sgrc.us/",
    counties: ["Atkinson", "Bacon", "Ben Hill", "Berrien", "Brantley", "Brooks", "Charlton", "Clinch", "Coffee", "Cook", "Echols", "Irwin", "Lanier", "Lowndes", "Pierce", "Tift", "Turner", "Ware"],
  },
  {
    id: "swgrc",
    name: "Southwest Georgia Regional Commission",
    short: "Southwest Georgia",
    phone: "(229) 522-3552",
    website: "https://www.swgrc.org/",
    counties: ["Baker", "Calhoun", "Colquitt", "Decatur", "Dougherty", "Early", "Grady", "Lee", "Miller", "Mitchell", "Seminole", "Terrell", "Thomas", "Worth"],
  },
  {
    id: "rivervalley",
    name: "River Valley Regional Commission",
    short: "River Valley (Columbus area)",
    phone: "(706) 256-2910",
    website: "https://www.rivervalleyrc.org/",
    counties: ["Chattahoochee", "Clay", "Crisp", "Dooly", "Harris", "Macon", "Marion", "Muscogee", "Quitman", "Randolph", "Schley", "Stewart", "Sumter", "Talbot", "Taylor", "Webster"],
  },
  {
    id: "coastal",
    name: "Coastal Georgia Regional Commission",
    short: "Coastal Georgia",
    phone: "(912) 264-7363",
    website: "https://www.coastalrc.org/",
    counties: ["Bryan", "Camden", "Chatham", "Effingham", "Glynn", "Liberty", "Long", "McIntosh"],
  },
];

export const COUNTY_TO_AAA = AAAS.reduce((map, aaa) => {
  aaa.counties.forEach((county) => {
    map[county] = aaa.id;
  });
  return map;
}, {});

export function findAaa(county) {
  const id = COUNTY_TO_AAA[county];
  return AAAS.find((aaa) => aaa.id === id) || null;
}

// Coarse ZIP-prefix lookup so a ZIP search can suggest the right region.
export const ZIP_PREFIX_COUNTIES = {
  "300": ["Cobb", "Cherokee", "Forsyth", "Gwinnett", "Fulton"],
  "301": ["Cobb", "Paulding", "Douglas", "Haralson", "Carroll", "Bartow", "Polk", "Floyd"],
  "302": ["Fulton", "Clayton", "Fayette", "Coweta", "Henry", "Spalding", "Douglas"],
  "303": ["Fulton", "DeKalb", "Clayton"],
  "304": ["Bulloch", "Screven", "Evans", "Tattnall", "Candler", "Emanuel", "Jenkins"],
  "305": ["Hall", "Habersham", "Rabun", "White", "Stephens", "Franklin", "Hart", "Banks", "Lumpkin", "Dawson", "Union", "Towns", "Jackson", "Gwinnett"],
  "306": ["Clarke", "Oconee", "Oglethorpe", "Madison", "Jackson", "Barrow", "Walton", "Greene", "Morgan", "Elbert", "Wilkes", "Lincoln", "Taliaferro", "Newton", "Jasper"],
  "307": ["Whitfield", "Murray", "Gordon", "Catoosa", "Walker", "Dade", "Chattooga", "Floyd"],
  "308": ["Richmond", "Columbia", "McDuffie", "Burke", "Jefferson", "Warren", "Glascock", "Lincoln", "Wilkes", "Hancock"],
  "309": ["Richmond", "Columbia", "Burke", "Jefferson", "Jenkins", "Screven"],
  "310": ["Houston", "Bibb", "Peach", "Crawford", "Twiggs", "Jones", "Baldwin", "Wilkinson", "Washington", "Pulaski", "Dooly", "Macon", "Taylor", "Schley", "Sumter", "Crisp"],
  "312": ["Bibb", "Monroe", "Jones", "Twiggs", "Houston", "Peach", "Crawford", "Baldwin", "Putnam"],
  "313": ["Chatham", "Effingham", "Bryan", "Liberty", "McIntosh", "Glynn", "Long"],
  "314": ["Chatham", "Effingham", "Bryan", "Liberty", "McIntosh"],
  "315": ["Ware", "Pierce", "Brantley", "Charlton", "Clinch", "Echols", "Wayne", "Glynn", "Camden", "Coffee", "Atkinson"],
  "316": ["Lowndes", "Berrien", "Cook", "Lanier", "Brooks", "Echols", "Atkinson", "Clinch"],
  "317": ["Dougherty", "Lee", "Worth", "Colquitt", "Mitchell", "Baker", "Calhoun", "Terrell", "Sumter", "Crisp", "Turner", "Tift"],
  "318": ["Muscogee", "Harris", "Chattahoochee", "Marion", "Talbot", "Taylor", "Stewart", "Webster", "Randolph", "Quitman", "Clay", "Sumter"],
  "319": ["Muscogee", "Harris", "Chattahoochee", "Marion", "Talbot", "Taylor"],
  "398": ["Decatur", "Grady", "Thomas", "Miller", "Seminole", "Early", "Mitchell", "Colquitt", "Baker"],
};

export function zipToCounties(zip) {
  const prefix = String(zip || "").trim().slice(0, 3);
  return ZIP_PREFIX_COUNTIES[prefix] || [];
}

export const INTAKE_CHECKLIST = [
  {
    title: "Call before a crisis",
    body: "EDWP (CCSP/SOURCE) waivers and home-delivered meal slots routinely carry waitlists, so start the ADRC screening early even if help is not needed yet.",
  },
  {
    title: "Verify the 2026 age and income rules",
    body: "Adults 60 to 64 or anyone working part-time should apply for regular SNAP rather than Senior SNAP. Above $2,982 a month, a Qualified Income Trust can still open CCSP eligibility.",
  },
  {
    title: "Prepare one verification packet",
    body: "Photo ID, Social Security award letters, proof of Georgia residency, recent bank statements, lease or mortgage, utility bills, and out-of-pocket medical receipts.",
  },
  {
    title: "Use senior priority windows",
    body: "Apply on the first business day of priority LIHEAP windows (April 1 for cooling help for households with someone 65+), and file county homestead exemptions by April 1.",
  },
  {
    title: "Track the appeal clocks",
    body: "If a Medicaid waiver or Medicare claim is denied, request a fair hearing within 30 days, or a Medicare redetermination within 120 days.",
  },
];