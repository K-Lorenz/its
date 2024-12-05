import { MDXRemote } from "next-mdx-remote";
import { StepType } from "../types/types";
interface StepProps {
  step: StepType;
  buttonClicked: (button: string) => void;
  active: boolean;
}


export default function Step({step, active, buttonClicked}: StepProps) {
  return (
    <div key={step.id} className="mb-6 bg-gray-100 md:p-10 p-7 rounded-md text-white scroll-m-3">
      <h2 className="text-2xl text-gray-700 mb-2">{step.title}</h2>
      <div className="text-gray-600 mb-7 ml-2 md:text-lg leading-loose ">
        <b>Dein Text: </b>
        {step.text && <MDXRemote {...step.text} />}
      </div>
      <h2 className="text-xl text-gray-700 mb-4">Antwort</h2>
      <div className="flex md:justify-start justify-between space-x-5">
        {step.linksto?.map((button) => (
          <button
            key={button.id}
            disabled={!active}
            onClick={()=>{
              if(button.destinationStepId){
                buttonClicked(button.destinationStepId)
              }else{
                buttonClicked("reset")
              }
            }}
            className={`hover:opacity-75 rounded-md disabled:opacity-50 
                ${
              button.buttonType === "Accept"
                ? "bg-green-500 text-white text-lg font-semibold px-6 py-3"
                : button.buttonType === "Cancel"
                ? "bg-red-500 text-white text-lg font-semibold px-6 py-3"
                : "bg-gray-500 text-lg font-semibold text-white px-6 py-3"
            }`}
          >
            {button.buttonText}
          </button>
        ))}
      </div>
    </div>
  );
}
