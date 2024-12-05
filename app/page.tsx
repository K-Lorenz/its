"use client";

import Step from "./components/step";
import { useState, useRef, useEffect } from "react";
import InputMask from "./components/inputMask";
import { StepType } from "./types/types";
import PocketBase from "pocketbase";
import {serialize} from "next-mdx-remote/serialize";

export default function Home() {
	const [info, setInfo] = useState({
		me: "",
		contactName: "",
		contactTime: "",
	});
	const [steps, setSteps] = useState<StepType[]>([]);
	const [displayedSteps, setDisplayedSteps] = useState<StepType[]>([]);
	const stepContainerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (displayedSteps.length > 0 && stepContainerRef.current) {
			const lastStepElement = stepContainerRef.current.lastElementChild;
			if (lastStepElement) {
				lastStepElement.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		}
	}, [displayedSteps.length, steps]);
	useEffect(() => {
    const pb = new PocketBase("https://db.its.klzdev.com");
    pb.collection("step_links")
    .getFullList({
      expand: "start_step",
    })
    .then((links) => {
      links.forEach(async(link) => {
        const start_step = link.expand?.start_step;
        const text = start_step.text;
        start_step.text = await serialize(start_step.text);
        if (start_step) {
          setSteps((prevSteps) => {
            // Check if this step already exists
            const existingStep = prevSteps.find((s) => s.id === start_step.id);
  
            if (existingStep) {
              // Update linksto if the step already exists
              return prevSteps.map((step) =>
                step.id === start_step.id
                  ? {
                      ...step,
                      linksto: [
                        ...step.linksto!,
                        {
                          id: link.id,
              destinationStepId: link.destination_step, // Assuming this is available
                          buttonType: link.button_type,
                          buttonText: link.button_text,
                        },
                      ],
                    }
                  : step
              );
            } else {
              // Add new step with initial link
              return [
                ...prevSteps,
                {
                  id: start_step.id,
                  rawText: text,
                  title: start_step.title,
                  text: start_step.text,
                  linksto: [
                    {
                      id: link.id,
            destinationStepId: link.destination_step, // Assuming this is available
                      buttonType: link.button_type,
                      buttonText: link.button_text,
                    },
                  ],
                  active: true,
                },
              ];
            }
          });
        }
      });
    });
  
	}, []);
	function addStep(step: string) {
    if(step === "reset"){
      setDisplayedSteps([])
      return
    }
		const newStep = steps.find((s) => s.id === step);
		setDisplayedSteps((prevSteps) => {
			return [
				...prevSteps.map((step) => ({
					...step,
					active: false,
				})),
				newStep!,
			];
		});
	}
	function onSave() {
		addStep(steps[0].id!);
	}
	return (
		<div className="bg-gray-200 min-h-screen w-full flex flex-col items-center space-y-5">
			<h1 className="text-3xl font-semibold text-black mt-12 mb-12">
				Interaktives TelefonSkript!
			</h1>
			{displayedSteps.length < 1 ? (
				<InputMask setInfo={setInfo} info={info} onSave={onSave} />
			) : (
				<div
					ref={stepContainerRef}
					className="bg-gray-400 md:p-8 p-4 rounded-md w-11/12"
				>
					{displayedSteps.map((step) => (
						<Step key={step.id} step={step} active={step.active} buttonClicked={addStep} />
					))}
				</div>
			)}
		</div>
	);
}
