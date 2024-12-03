import { InteractiveButton } from "../types/interactiveButton";

export type StepProps = {
  title: string;
  text: string;
  buttons: InteractiveButton[];
  disabled: boolean;
  key: number;
};

export default function Step({ title, text, buttons, disabled=false }: StepProps) {
  return (
    <div className="mb-6 bg-gray-100 p-10 rounded-md text-white">
      <h2 className="text-2xl text-gray-700 mb-2">{title}</h2>
      <p className="text-gray-600 mb-7 ml-2 text-lg leading-loose">
        <b>Dein Text: </b>
        {text}
      </p>
      <h2 className="text-xl text-gray-700 mb-4">Antwort</h2>
      <div className="flex items-center space-x-5">
        {buttons.map((button) => (
          <button
            key={button.buttonText}
            disabled={disabled}
            onClick={button.onClick}
            className={`hover:opacity-75 rounded-md disabled:opacity-50 
                ${
              button.buttonType === "Accept"
                ? "bg-green-500 text-white text-lg font-semibold px-6 py-3"
                : button.buttonType === "Cancel"
                ? "bg-red-500 text-white text-lg font-semibold px-6 py-3"
                : "bg-gray-500 text-md text-white px-2 py-2"
            }`}
          >
            {button.buttonText}
          </button>
        ))}
      </div>
    </div>
  );
}
