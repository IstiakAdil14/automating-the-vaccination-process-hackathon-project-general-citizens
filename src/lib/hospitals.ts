export type Hospital = {
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  district: string;
};

export const hospitals: Hospital[] = [
  { name: "Dhaka Medical College Hospital", address: "Zahir Raihan Rd, Dhaka 1000", phone: "+880-2-55165088", lat: 23.7261, lng: 90.3963, district: "Dhaka" },
  { name: "Sir Salimullah Medical College", address: "Mitford Rd, Dhaka 1100", phone: "+880-2-7314549", lat: 23.7104, lng: 90.4074, district: "Dhaka" },
  { name: "Shaheed Suhrawardy Medical College", address: "Sher-E-Bangla Nagar, Dhaka 1207", phone: "+880-2-9137025", lat: 23.7749, lng: 90.3668, district: "Dhaka" },
  { name: "Chittagong Medical College Hospital", address: "K.B. Fazlul Kader Rd, Chattogram 4203", phone: "+880-31-630954", lat: 22.3569, lng: 91.8350, district: "Chattogram" },
  { name: "250-Bed General Hospital Chattogram", address: "Pahartali, Chattogram", phone: "+880-31-752345", lat: 22.3900, lng: 91.8100, district: "Chattogram" },
  { name: "Rajshahi Medical College Hospital", address: "Rajshahi 6000", phone: "+880-721-772150", lat: 24.3745, lng: 88.6042, district: "Rajshahi" },
  { name: "Khulna Medical College Hospital", address: "Khulna 9000", phone: "+880-41-731010", lat: 22.8456, lng: 89.5403, district: "Khulna" },
  { name: "Sylhet MAG Osmani Medical College", address: "Sylhet 3100", phone: "+880-821-716497", lat: 24.8949, lng: 91.8687, district: "Sylhet" },
  { name: "Barisal Sher-E-Bangla Medical College", address: "Barisal 8200", phone: "+880-431-62614", lat: 22.7010, lng: 90.3535, district: "Barisal" },
  { name: "Rangpur Medical College Hospital", address: "Rangpur 5400", phone: "+880-521-63600", lat: 25.7439, lng: 89.2752, district: "Rangpur" },
  { name: "Mymensingh Medical College Hospital", address: "Mymensingh 2200", phone: "+880-91-52033", lat: 24.7471, lng: 90.4203, district: "Mymensingh" },
  { name: "Comilla Medical College Hospital", address: "Comilla 3500", phone: "+880-81-72000", lat: 23.4607, lng: 91.1809, district: "Cumilla" },
];

export const districts = [
  "Dhaka", "Chattogram", "Rajshahi", "Khulna", "Sylhet",
  "Barisal", "Rangpur", "Mymensingh", "Cumilla", "Gazipur",
  "Narayanganj", "Narsingdi", "Tangail", "Faridpur", "Jessore",
];

export function getHospitalsByDistrict(district: string): Hospital[] {
  return hospitals.filter((h) => h.district === district);
}

export function getNearestHospitals(lat: number, lng: number, count = 3): Hospital[] {
  return [...hospitals]
    .map((h) => ({
      ...h,
      distance: Math.sqrt(Math.pow(h.lat - lat, 2) + Math.pow(h.lng - lng, 2)) * 111,
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count) as Hospital[];
}
