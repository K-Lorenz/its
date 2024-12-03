'use client'
interface Info {
  me: string;
  contactName: string;
  contactTime: string;
}

interface InputMaskProps {
  info: Info;
  setInfo: React.Dispatch<React.SetStateAction<Info>>;
  onSave: () => void;
}

export default function InputMask({info, setInfo, onSave}: InputMaskProps) {

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setInfo((prevInfo) => ({
      ...prevInfo,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="mb-6 bg-gray-100 p-10 rounded-md text-white w-1/2">
      <h2 className="text-2xl text-gray-700 mb-4">Bitte geben Sie Ihre Informationen ein</h2>
      <div className="space-y-4">
        <div>
          <label className="text-gray-600 mb-2 block">Vollständiger Name</label>
          <input
            type="text"
            placeholder='Max Mustermensch'
            value={info.me}
            onChange={(e) => handleInputChange(e, 'me')}
            className="w-full p-3 rounded-md bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="text-gray-600 mb-2 block">Name des Kontakts</label>
          <input
            placeholder='Manuela Mustermensch'
            type="text"
            value={info.contactName}
            onChange={(e) => handleInputChange(e, 'contactName')}
            className="w-full p-3 rounded-md bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="text-gray-600 mb-2 block">Zeitpunkt des Kontakts</label>
          <input
            type="text"
            placeholder='auf der Messe in Karlsruhe Juni 2022'
            value={info.contactTime}
            onChange={(e) => handleInputChange(e, 'contactTime')}
            className="w-full p-3 rounded-md bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="mt-4">
          <button
            onClick={() => onSave()}
            className="w-full bg-green-500 text-white font-semibold p-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}
