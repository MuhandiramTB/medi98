"use client"
import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Line } from '../../components/Line';
import { MediColumn } from '../../components/MediColumn';
import MedicationSelection from '../../components/MedicationSelection';
import jsPDF from 'jspdf';




interface TreatmentDetail {
    description: string;
    unitPrice: string;
    discount: string;
    price: number;
}

interface MedicationDetail {
    medication: string;
    quantity: number;
    unitPrice: string;
    discount: string;
    price: number;
}

const PatientManagementSystem: React.FC = () => {
    const [treatmentDetails, setTreatmentDetails] = useState<TreatmentDetail[]>([]);
    const [medicationDetails, setMedicationDetails] = useState<MedicationDetail[]>([]);
    const [paidBalance, setPaidBalance] = useState<number>(0); // Adding paidBalance state
    const [discount, setDiscount] = useState<number>(0);

    const handleAddTreatment = () => {
        const newTreatmentDetails: TreatmentDetail = {
            description: "",
            unitPrice: "1000.00",
            discount: "0.00%",
            price: 0
        };
        // Calculate price with two decimal places
        newTreatmentDetails.price = parseFloat(newTreatmentDetails.unitPrice) * (1 - parseFloat(newTreatmentDetails.discount) / 100);
        // Format price to two decimal places
        newTreatmentDetails.price = parseFloat(newTreatmentDetails.price.toFixed(2));
        setTreatmentDetails([...treatmentDetails, newTreatmentDetails]);
    };

    const handleAddMedication = () => {
        const newMedicationDetails: MedicationDetail = {
            medication: "",
            quantity: 15,
            unitPrice: "10.00",
            discount: "0.00%",
            price: 0
        };
        // Calculate price with two decimal places
        newMedicationDetails.price = parseFloat(newMedicationDetails.unitPrice) * newMedicationDetails.quantity * (1 - parseFloat(newMedicationDetails.discount) / 100);
        // Format price to two decimal places
        newMedicationDetails.price = parseFloat(newMedicationDetails.price.toFixed(2));
        setMedicationDetails([...medicationDetails, newMedicationDetails]);
    };

    const handleDescriptionChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newTreatmentDetails = [...treatmentDetails];
        newTreatmentDetails[index].description = e.target.value;
        setTreatmentDetails(newTreatmentDetails);
    };

    const handleUnitPriceChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newTreatmentDetails = [...treatmentDetails];
        newTreatmentDetails[index].unitPrice = e.target.value;
        const unitPriceNumber = parseFloat(e.target.value) || 0;
        newTreatmentDetails[index].price = unitPriceNumber * (1 - parseFloat(newTreatmentDetails[index].discount) / 100);
        newTreatmentDetails[index].price = parseFloat(newTreatmentDetails[index].price.toFixed(2));
        setTreatmentDetails(newTreatmentDetails);
    };

    const handleDiscountChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newTreatmentDetails = [...treatmentDetails];
        newTreatmentDetails[index].discount = e.target.value;
        newTreatmentDetails[index].price = parseFloat(newTreatmentDetails[index].unitPrice) * (1 - parseFloat(e.target.value) / 100);
        newTreatmentDetails[index].price = parseFloat(newTreatmentDetails[index].price.toFixed(2));
        setTreatmentDetails(newTreatmentDetails);
    };

    const handleMedicationChange = (index: number, medication: string) => {
        const newMedicationDetails = [...medicationDetails];
        newMedicationDetails[index].medication = medication;
        setMedicationDetails(newMedicationDetails);
    };

    const handleQuantityChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newMedicationDetails = [...medicationDetails];
        newMedicationDetails[index].quantity = parseInt(e.target.value);
        // Recalculate medication price when quantity changes
        newMedicationDetails[index].price = parseFloat(newMedicationDetails[index].unitPrice) * newMedicationDetails[index].quantity * (1 - parseFloat(newMedicationDetails[index].discount) / 100);
        newMedicationDetails[index].price = parseFloat(newMedicationDetails[index].price.toFixed(2));
        setMedicationDetails(newMedicationDetails);
    };

    const handleMedicationUnitPriceChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newMedicationDetails = [...medicationDetails];
        newMedicationDetails[index].unitPrice = e.target.value;
        // Recalculate medication price when unit price changes
        newMedicationDetails[index].price = parseFloat(e.target.value) * newMedicationDetails[index].quantity * (1 - parseFloat(newMedicationDetails[index].discount) / 100);
        newMedicationDetails[index].price = parseFloat(newMedicationDetails[index].price.toFixed(2));
        setMedicationDetails(newMedicationDetails);
    };

    const handleMedicationDiscountChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newMedicationDetails = [...medicationDetails];
        newMedicationDetails[index].discount = e.target.value;
        // Recalculate medication price when discount changes
        newMedicationDetails[index].price = parseFloat(newMedicationDetails[index].unitPrice) * newMedicationDetails[index].quantity * (1 - parseFloat(e.target.value) / 100);
        newMedicationDetails[index].price = parseFloat(newMedicationDetails[index].price.toFixed(2));
        setMedicationDetails(newMedicationDetails);
    };

    // Calculate total balance including both treatments and medications
    const totalBalance = treatmentDetails.reduce((acc, curr) => acc + curr.price, 0) +
        medicationDetails.reduce((acc, curr) => acc + curr.price, 0);

    const remainingBalance = totalBalance - paidBalance;

    const handlePrintBill = () => {
        window.print();
    };
    const downloadPrescription = () => {
        const doc = new jsPDF();
    
        // Add content to the PDF
        doc.text('Prescription', 10, 10);
        doc.text('Medications:', 10, 20);
        // Add medication details
        medicationDetails.forEach((medication, index) => {
            const yPos = 30 + index * 10; // Adjust yPos based on index
            doc.text(`${medication.medication}: ${medication.quantity} units`, 10, yPos);
        });
    
        // Save the PDF
        doc.save('prescription.pdf');
    };
    return (
        <div className='p-4 grid grid-cols-1 gap-4 bg-midnight text-tahiti'>
            <div className="bg-blue-100 text-white p-2">
            </div>
            
<div className="flex justify-between pt-4">
    <button
        className="text-black font-medium text-sm px-5 py-2.5 bg-white border border-black hover:bg-blue-300 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-800 transition duration-200"
        onClick={handleAddTreatment}
        style={{ width: '350px' }} // Set custom width for the button
    >
        Add Treatment
    </button>
    <button
        className="text-black font-medium text-sm px-5 py-2.5 bg-white border border-black hover:bg-blue-300 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-800 transition duration-200"
        onClick={handleAddMedication}
        style={{ width: '350px' }} // Set custom width for the button
    >
        Add Medication
    </button>
</div>


            
<div className='p-4'>
    {treatmentDetails.map((treatment, index) => (
        <div key={index} className="grid grid-cols-5 gap-2" style={{ marginBottom: '20px' }}> {/* Add margin bottom */}
            <MediColumn label="Treatment" columnFor={`treatment-description-${index}`}>
                <input type="text" value={treatment.description} onChange={(e) => handleDescriptionChange(index, e)} />
            </MediColumn>
            <MediColumn label="" columnFor={`treatment-description-${index}`}>
                <input type=""  onChange={(e) => handleDescriptionChange(index, e)} />
            </MediColumn>
            <MediColumn label="Unit Price" columnFor={`unit-price-${index}`}>
                <input type="text" value={treatment.unitPrice} onChange={(e) => handleUnitPriceChange(index, e)} />
            </MediColumn>
            <MediColumn label="Discount" columnFor={`discount-${index}`}>
                <input type="text" value={treatment.discount} onChange={(e) => handleDiscountChange(index, e)} />
            </MediColumn>
            <MediColumn label="Price" columnFor={`price-${index}`}>
                <span>{treatment.price.toFixed(2)}</span>
            </MediColumn>
        </div>
    ))}
    {medicationDetails.map((medication, index) => (
        <div key={index} className="grid grid-cols-5 gap-2">
            <MedicationSelection
                onSelect={(selection) => handleMedicationChange(index, selection)}
            />
            <MediColumn label="Quantity" columnFor={`quantity-${index}`}>
                <input type="number" value={medication.quantity} onChange={(e) => handleQuantityChange(index, e)} />
            </MediColumn>
            <MediColumn label="Unit Price" columnFor={`medication-unit-price-${index}`}>
                <input type="number" value={medication.unitPrice} onChange={(e) => handleMedicationUnitPriceChange(index, e)} />
            </MediColumn>
            <MediColumn label="Discount" columnFor={`medication-discount-${index}`}>
                <input type="text" value={medication.discount} onChange={(e) => handleMedicationDiscountChange(index, e)} />
            </MediColumn>
            <MediColumn label="Price" columnFor={`medication-price-${index}`}>
                <span>{medication.price.toFixed(2)}</span>
            </MediColumn>
        </div>
    ))}
</div>
<Line />


<div className='p-4'>
                
                <div className="grid grid-cols-5 gap-2">
                     {/* Use grid to align payment details */}
    <div className="flex items-center"> {/* Use flex for label and input alignment */}
        <p className="mr-2">Total</p>
        
    </div>
    <div className="flex items-center"> {/* Use flex for label and input alignment */}
        <p className="mr-2"></p>
        
    </div>
    <div className="flex flex-col "> {/* Use flex for label and input alignment */}
        <p className="mr-2">Total Balance:</p>
        <span>{totalBalance.toFixed(2)}</span>
        
    </div>

    <div className="flex flex flex-col"> {/* Use flex for label and input alignment */}
        <p className="mr-2">Paid Balance:</p>
        <input type="text" value={paidBalance} onChange={(e) => setPaidBalance(parseFloat(e.target.value))} />
    </div>
    <div className="flex flex flex-col"> {/* Use flex for label and input alignment */}
        <p className="mr-2">Remaining Balance:</p>
        <span>{remainingBalance.toFixed(2)}</span>
    </div>


</div>
<Line />


<div className="flex justify-between pt-4">
    <div>
        <button
            className="text-white font-medium rounded-lg text-sm px-5 py-2.5 mr-4 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800"
            onClick={downloadPrescription}
        >
            Download Prescription
        </button>
    </div>
    <div>
        <button
            className="text-white font-medium rounded-lg text-sm px-5 py-2.5 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800"
            onClick={() => window.print()}
        >
            Print Bill
        </button>
    </div>
</div>


                </div>
            </div>
    
    );
};

export default PatientManagementSystem;
