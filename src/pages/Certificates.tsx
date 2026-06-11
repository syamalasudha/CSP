import React, { useState } from "react";
import { GlassCard } from "../components/UIComponents";
import { useLanguage } from "../components/LanguageContext";
import { FileText } from "lucide-react";

export const Certificates: React.FC = () => {
  const { language } = useLanguage();

  const [selectedCertificate, setSelectedCertificate] =
    useState<any>(null);

  const certificates = [
{
id: "income",
name: "Income Certificate",
description:
"Used for scholarships, fee reimbursement and welfare schemes.",
documents: [
"Aadhaar Card",
"Ration Card",
"Income Proof",
"Passport Size Photo",
],
steps: [
"Visit Village Secretariat / MeeSeva",
"Fill application form",
"Attach required documents",
"Verification by authorities",
"Certificate issued",
],
 downloadUrl: "/forms/income-certificate.pdf",
},


{
  id: "caste",
  name: "Caste Certificate",
  description:
    "Proof of caste category for reservations and government schemes.",
  documents: [
    "Aadhaar Card",
    "Ration Card",
    "School Record",
    "Community Proof",
  ],
  steps: [
    "Submit application",
    "Attach supporting documents",
    "Field verification",
    "Approval by Tahsildar",
    "Certificate issued",
  ],
   downloadUrl: "/forms/caste-certificate.pdf",
},



{
  id: "birth",
  name: "Birth Certificate",
  description: "Official proof of birth registration.",
  documents: [
    "Hospital Record",
    "Parent Aadhaar",
    "Birth Report",
  ],
  steps: [
    "Submit birth details",
    "Verification",
    "Registration",
    "Approval",
    "Certificate issued",
  ],
   downloadUrl: "/forms/birth-certificate.pdf",
},

{
  id: "death",
  name: "Death Certificate",
  description: "Official proof of death registration.",
  documents: [
    "Death Report",
    "Hospital Certificate",
    "Applicant ID Proof",
  ],
  steps: [
    "Submit application",
    "Verification",
    "Registration",
    "Approval",
    "Certificate issued",
  ],
    downloadUrl: "/forms/death-certificate.pdf",
},

{
  id: "family",
  name: "Family Member Certificate",
  description:
    "Lists family members for legal and administrative purposes.",
  documents: [
    "Aadhaar Card",
    "Ration Card",
    "Family Details",
  ],
  steps: [
    "Submit application",
    "Attach family details",
    "Verification",
    "Approval",
    "Certificate issued",
  ],
   downloadUrl: "/forms/familymember-certificate.pdf",
},

{
  id: "ricecard",
  name: "Rice Card Services",
  description:
    "New Rice Card application, member addition/deletion, corrections and address changes.",
  documents: [
    "Aadhaar Card",
    "Passport Size Photo",
    "Mobile Number",
    "Address Proof"
  ],
  steps: [
    "Visit Village Secretariat / MeeSeva",
    "Submit application",
    "Attach required documents",
    "Verification by authorities",
    "Rice Card service completed"
  ],
   downloadUrl: "/forms/rice-certificate.pdf",
},

{
  id: "aadhaar-update",
  name: "Aadhaar Update Service",
  description:
    "Apply for Aadhaar corrections and updates such as name, address, mobile number, date of birth and biometric updates.",
  documents: [
    "Existing Aadhaar Card",
    "Proof of Identity",
    "Proof of Address",
    "Mobile Number"
  ],
  steps: [
    "Visit Aadhaar Update Center / MeeSeva",
    "Submit Aadhaar update request",
    "Attach supporting documents",
    "Biometric verification (if required)",
    "Updated Aadhaar generated"
  ],
  downloadUrl: "/forms/aadhaarupdate.pdf",
},

{
  id: "ews",
  name: "EWS Certificate",
  description:
    "Economically Weaker Section certificate used for education, employment and reservation benefits.",
  documents: [
    "Aadhaar Card",
    "Income Certificate",
    "Property Details",
    "Ration Card"
  ],
  steps: [
    "Visit Village Secretariat / MeeSeva",
    "Submit application",
    "Attach required documents",
    "Verification by authorities",
    "Certificate issued"
  ],
   downloadUrl: "/forms/ews-certificate.pdf",
},

{
  id: "obc",
  name: "OBC Certificate",
  description:
    "Certificate issued to eligible Other Backward Class (OBC) applicants for reservations and welfare schemes.",
  documents: [
    "Aadhaar Card",
    "Community Proof",
    "Ration Card",
    "Passport Size Photo"
  ],
  steps: [
    "Visit Village Secretariat / MeeSeva",
    "Submit application",
    "Attach required documents",
    "Community verification",
    "Certificate issued"
  ],
  downloadUrl: "/forms/obc-certificate.pdf",

},


];

const schemes = [
  {
    name: "NTR Bharosa Pension Scheme",
    eligibility: "Senior citizens, widows, disabled persons and other eligible beneficiaries."
  },
  {
    name: "Anna Canteens",
    eligibility: "Available for all citizens."
  },
  {
    name: "Deepam Scheme",
    eligibility: "Eligible women and families."
  },
  {
    name: "Farmer Welfare Schemes",
    eligibility: "Eligible farmers and agricultural workers."
  },
  {
  name: "Thalliki Vandanam",
  eligibility:
    "Mothers/guardians of eligible students studying in recognized schools as per government guidelines."
},

{
  name: "NTR Bharosa Pension Scheme",
  eligibility:
    "Senior citizens, widows, disabled persons, weavers, toddy tappers and other eligible beneficiaries."
}
];

return ( <div className="space-y-10"> <div className="text-center"> <h1 className="text-4xl font-bold">
Citizen Services </h1>


    <p className="text-slate-500 mt-3">
      Access certificate information,
      required documents and downloadable forms.
    </p>
  </div>

  <section>
    <h2 className="text-2xl font-bold mb-6">
      Available Certificates
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {certificates.map((cert) => (
        <GlassCard
          key={cert.id}
          hoverEffect
          className="p-5"
        >
          <FileText className="w-8 h-8 text-gov-600 mb-3" />

          <h3 className="font-bold text-lg">
            {cert.name}
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            {cert.description}
          </p>

          <div className="flex gap-2 mt-5">
            <button
              onClick={() =>
                setSelectedCertificate(cert)
              }
              className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700"
            >
              View Details
            </button>

           <a
  href={cert.downloadUrl}
  download
  target="_blank"
  rel="noopener noreferrer"
  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
>
  Download Form
</a>
          </div>
        </GlassCard>
      ))}
    </div>
  </section>


{/* Government Schemes Section */}
<section className="mt-12">
  <h2 className="text-2xl font-bold mb-6">
    Government Schemes & Eligibility
  </h2>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {schemes.map((scheme) => (
      <GlassCard key={scheme.name} className="p-5">
        <h3 className="font-bold text-lg">
          {scheme.name}
        </h3>

        <p className="mt-3 text-sm">
          <strong>Eligibility:</strong> {scheme.eligibility}
        </p>
      </GlassCard>
    ))}
  </div>
</section>

{selectedCertificate && (
 
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-xl p-6 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-bold mb-3">
          {selectedCertificate.name}
        </h2>

       <p className="text-slate-300 mb-4">
          {selectedCertificate.description}
        </p>

        <h3 className="font-semibold mb-2">
          Required Documents
        </h3>

       <ul className="list-disc ml-5 mb-4 text-slate-300">
          {selectedCertificate.documents.map(
            (doc: string) => (
              <li key={doc}>{doc}</li>
            )
          )}
        </ul>

        <h3 className="font-semibold mb-2">
          Application Process
        </h3>

      <ol className="list-decimal ml-5 mb-4 text-slate-300">
          {selectedCertificate.steps.map(
            (step: string, index: number) => (
              <li key={index}>{step}</li>
            )
          )}
        </ol>

        <div className="flex gap-3">
          <a
  href={selectedCertificate.downloadUrl}
  download
  className="bg-blue-600 text-white px-4 py-2 rounded-md"
>
  Download Form
</a>

          <button
            onClick={() =>
              setSelectedCertificate(null)
            }
            className="bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}
</div>


);
};
