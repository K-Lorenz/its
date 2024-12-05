"use client";

import PocketBase from "pocketbase";
import { useEffect, useState } from "react";
import { ButtonType, LinkType, StepType } from "../types/types";
import { ForwardRefEditor } from "../components/ForwardRefEditor";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { filter, MDXEditor, MDXEditorMethods } from "@mdxeditor/editor";
import React from "react";
import { randomBytes } from "crypto";
import { useRouter } from "next/navigation";
import {
	Description,
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
} from "@headlessui/react";

const pb = new PocketBase("https://db.its.klzdev.com");

export default function edit() {
	let isEdit = localStorage.getItem("edit");
	const [steps, setSteps] = useState<StepType[]>([]);
	const [activeStepId, setActiveStepId] = useState<string>("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editButton, setEditButton] = useState<LinkType>();
	const [buttons, setButtons] = useState<LinkType[]>([]);
	const router = useRouter();
	const getSteps = async () => {
		pb.collection("step_links")
			.getFullList({
				expand: "start_step",
				requestKey: null,
			})
			.then((links) => {
				links.forEach(async (link) => {
					let start_step = link.expand?.start_step;
					var text = start_step.text;
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
													...step.linksto!.filter(
														(existingLink) =>
															existingLink.id !== link.id &&
															existingLink.destinationStepId !==
																link.destination_step
													),
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
										title: start_step.title,
										rawText: text,
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
		pb.collection("steps")
			.getFullList()
			.then((steps) => {
				steps.forEach(async (step) => {
					const text = await serialize(step.text);
					setSteps((prevSteps) => {
						// Check if this step already exists
						const existingStep = prevSteps.find((s) => s.id === step.id);
						if (!existingStep) {
							return [
								...prevSteps,
								{
									id: step.id,
									title: step.title,
									rawText: step.text,
									text: text,
									linksto: [],
									active: true,
								},
							];
						}
						return prevSteps;
					});
				});
			});
	};
	const [selectedOption, setSelectedOption] = useState("");
	const [selectedStep, setSelectedStep] = useState("");

	const options: { id: ButtonType; style: string }[] = [
		{ id: "Accept", style: "bg-green-500" },
		{ id: "Cancel", style: "bg-red-500" },
		{ id: "Neutral", style: "bg-gray-500" },
	];
	useEffect(() => {
		getSteps();
		getButtons();
	}, []);
	const getButtons = async () => {
		pb.collection("step_links")
			.getFullList()
			.then((links) => {
				links.forEach(async (link) => {
					setButtons((prevButtons) => [
						...prevButtons,
						{
							id: link.id,
							destinationStepId: link.destination_step,
							buttonType: link.button_type,
							buttonText: link.button_text,
						},
					]);
				});
			});
	};
	const buttonClicked = (buttonId: string) => {
    setEditButton(buttons.find((button) => button.id === buttonId));
    setSelectedStep(buttons.find((button) => button.id === buttonId)?.destinationStepId!);
    setSelectedOption(buttons.find((button) => button.id === buttonId)?.buttonType!);
		setDialogOpen(true);
	};
	const addButton = () => {
    let newID = "_" + randomBytes(16).toString("hex");
		setSteps((prevSteps) => {
			return prevSteps.map((step) =>
				step.id === activeStepId
					? {
							...step,
							linksto: [
								...step.linksto!,
								{
									id: newID,
									destinationStepId: "",
									buttonType: "Neutral",
									buttonText: "Neuer Knopf",
								},
							],
					  }
					: step
			);
		});
    setButtons((prevButtons) => {
      return [
        ...prevButtons,
        {
          id: newID,
          destinationStepId: "",
          buttonType: "Neutral",
          buttonText: "Neuer Knopf",
        },
      ];
    })
	};
	const addStep = () => {
		setSteps((prevSteps) => {
			return [
				...prevSteps,
				{
					id: "_" + randomBytes(16).toString("hex"),
					title: "Neuer Schritt",
					rawText: "",
					linksto: [],
					active: true,
				},
			];
		});
	};
	const deleteStep = (id: string) => {
		setSteps((prevSteps) => {
			return prevSteps.filter((step) => step.id !== id);
		});
		pb.collection("steps").delete(id);
	};
	const editorRef = React.useRef<MDXEditorMethods>(null);
	const changeStep = (stepI: StepType) => {
		setActiveStepId(stepI.id);
		editorRef.current?.setMarkdown(stepI.rawText);
	};
	const handleTextChange = (e: string) => {
		setSteps((prevSteps) => {
			return prevSteps.map((step) =>
				step.id === activeStepId
					? {
							...step,
							rawText: e,
					  }
					: step
			);
		});
	};
	const handleTitleChange = (e: string) => {
		setSteps((prevSteps) => {
			return prevSteps.map((step) =>
				step.id === activeStepId
					? {
							...step,
							title: e,
					  }
					: step
			);
		});
	};
	const close = () => {
		steps.map((step) => {
			if (step.id.startsWith("_")) {
				pb.collection("steps")
					.create({
						title: step.title,
						text: step.rawText,
					})
					.then((res) => {});
			} else {
				pb.collection("steps")
					.update(step.id, {
						title: step.title,
						text: step.rawText,
					})
					.then((res) => {
						console.log(res);
					});
			}
			step.linksto?.map((link) => {
				if (link.id.startsWith("_")) {
					pb.collection("step_links")
						.create({
							button_text: link.buttonText,
							button_type: link.buttonType,
							destination_step: link.destinationStepId,
							start_step: step.id,
						})
						.then((res) => {});
				} else {
					pb.collection("step_links")
						.update(link.id, {
							button_text: link.buttonText,
							button_type: link.buttonType,
							destination_step: link.destinationStepId,
						})
						.then((res) => {});
				}
			});
      console.log(step)
		});
		router.push("/");
	};
	const saveEverything = () => {
		setSteps((prevSteps) => {
			return prevSteps.map((step) =>
				step.id === activeStepId
					? {
							...step,
							linksto: [
								...step.linksto!.filter(
									(existingLink) => existingLink.id !== editButton?.id
								),
								{
									id: editButton?.id!,
									destinationStepId: editButton?.destinationStepId!,
									buttonType: editButton?.buttonType!,
									buttonText: editButton?.buttonText!,
								},
							],
					  }
					: step
			);
		});
		setSelectedOption("");
	};
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditButton({
			...editButton!,
			buttonText: e.target.value,
		});
    setButtons((prevButtons) => {
      return prevButtons.map((button) =>
        button.id === editButton?.id
          ? {
              ...button,
              buttonText: e.target.value,
            }
          : button
      );
    })
	};
  const deleteButton = async(id: string) => {
    pb.collection("step_links").delete(id)
  }

	return isEdit ? (
		<>
			<div className="bg-gray-200 min-h-fit w-full h-screen flex flex-col space-y-5 text-black">
				<h1 className="text-3xl text-center mt-2 ">Einträge bearbeiten</h1>
				<button
					onClick={() => close()}
					className="fixed rounded-md -top-2 left-3 text-white font-semibold bg-red-600 px-4 py-2 "
				>
					zurück
				</button>
				<div className="flex mb-10 flex-row h-[calc(100vh-4rem)] w-full space-x-3 justify-between">
					<div className="relative p-2 w-1/5 bg-gray-800 rounded-e-md">
						<div className=" flex flex-col h-[93%] p-2">
							<div className="flex flex-col space-y-2 overflow-auto ">
								{steps.map((steps) => (
									<button
										key={steps.id}
										className={`hover:text-gray-500 px-5 py-4 text-left bg-gray-100 rounded-md 
                      ${
												steps.id === activeStepId
													? " border-4 border-green-500 "
													: ""
											}`}
										onClick={() => {
											if (steps.id !== activeStepId) {
												changeStep(steps);
											}
										}}
									>
										<div className="text-2xl font-semibold ">{steps.title}</div>
										<div className="line-clamp-3">
											{steps.text ? <MDXRemote {...steps.text} /> : ""}
										</div>
									</button>
								))}
							</div>
						</div>
						<button
							onClick={addStep}
							className="absolute bottom-0 left-0 right-0 mx-4 my-2 text-3xl bg-green-500 hover:opacity-75 text-white rounded-md p-2"
						>
							+
						</button>
					</div>

					<div className="relative flex flex-col w-4/5 bg-gray-300 p-10 border-solid border-2 rounded-md border-gray-700">
						<button
							onClick={() => deleteStep(activeStepId)}
							className="absolute top-2 right-2 bg-red-500 rounded-md py-2 px-4 text-white font-semibold"
						>
							löschen
						</button>
						<label className="text-gray-600 block">Titel</label>
						<input
							type="text"
							value={steps.find((step) => activeStepId === step.id)?.title || ""}
							onChange={(e) => handleTitleChange(e.target.value)}
							className="w-full p-3 rounded-md bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
							required
						/>
						<label className="mt-6 text-gray-600 block">Text</label>

						<div className=" bg-white rounded-md h-full">
							<ForwardRefEditor
								markdown={""}
								ref={editorRef}
								onChange={(e) => handleTextChange(e)}
							/>
						</div>
						<label className="text-gray-600 block mt-8">Knöpfe</label>
						<div className="flex flex-row justify-between px-4 py-2 h-1/5 bg-white rounded-md">
							<div className="flex flex-row overflow-scroll space-x-4">
								{steps
									.find((step) => activeStepId === step.id)
									?.linksto?.map((button) => (
										<button
											key={button.id}
											onClick={() => {
												buttonClicked(button.id);
											}}
											className={`hover:opacity-75 rounded-md disabled:opacity-50 text-white text-lg font-semibold px-6 py-3 
                ${
									button.buttonType === "Accept"
										? "bg-green-500"
										: button.buttonType === "Cancel"
										? "bg-red-500"
										: "bg-gray-500"
								}`}
										>
											{button.buttonText}
											<p className="text-sm font-normal">
												{steps.findLast(
													(step) => step.id === button.destinationStepId
												)?.title
													? "-> " +
													  steps.findLast(
															(step) => step.id === button.destinationStepId
													  )?.title
													: "RESTART"}
											</p>
										</button>
									))}
							</div>
							<button
								onClick={() => addButton()}
								className="hover:opacity-75 rounded-md bg-green-500 h-full px-5 text-3xl text-white font-semibold"
							>
								+
							</button>
						</div>
					</div>
				</div>
			</div>
			<Dialog
				open={dialogOpen}
				onClose={() => {
					saveEverything();
					setDialogOpen(false);
				}}
				className="relative z-50"
			>
				<DialogBackdrop className="fixed inset-0 bg-black/70" />
				<div className="fixed inset-0 flex w-screen items-center justify-center p-4">
					<DialogPanel className="max-w-lg space-y-4 border text-black p-12 bg-gray-300 rounded-md">
						<DialogTitle className="font-bold flex items-center justify-between ">
							Du Bearbeitest gerade{" "}
							<span
								className={`rounded-md disabled:opacity-50 
                ${
									editButton?.buttonType === "Accept"
										? "bg-green-500 text-white text-lg font-semibold px-6 py-3"
										: editButton?.buttonType === "Cancel"
										? "bg-red-500 text-white text-lg font-semibold px-6 py-3"
										: "bg-gray-500 text-lg font-semibold text-white px-6 py-3"
								}`}
							>
								{editButton?.buttonText}
							</span>
						</DialogTitle>
						<Description>
							Hier kannst du den Zielort, den Text und die Farbe verändern.
						</Description>
						<div className="flex flex-col space-y-4">
							<label>Knopf-Text</label>
							<input
								type="text"
								value={editButton?.buttonText || ""}
								onChange={(e) => handleInputChange(e)}
								className="w-full p-3 rounded-md bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
								required
							/>
							<label>Zielort</label>
							<div className="flex flex-col space-y-2 p-2 bg-gray-100">
              <button onClick={()=>{
                setEditButton({
                  ...editButton!,
                  destinationStepId: ""
                })
                setButtons((prevButtons) => {
                  return prevButtons.map((button) =>
                    button.id === editButton?.id
                      ? {
                          ...button,
                          destinationStepId: "",
                        }
                      : button
                  );
                })
                setSelectedStep("")
              }} className={`p-4 rounded-lg font-bold text-white bg-gray-500 ${selectedStep === ""? "ring-4 ring-offset-2" : ""}`}>Neustarten</button>
								{steps.map((step) => (
									<button
										key={step.id}
										className={`p-4 rounded-lg font-bold text-white ${
											selectedStep === step.id ? "ring-4 ring-offset-2" : ""
										} bg-gray-500`}
										onClick={() => {
											setEditButton({
												...editButton!,
												destinationStepId: step.id,
											});
                      setButtons((prevButtons) => {
                        return prevButtons.map((button) =>
                          button.id === editButton?.id
                            ? {
                                ...button,
                                destinationStepId: step.id,
                              }
                            : button
                        );
                      })
											setSelectedStep(step.id);
										}}
									>
										{step.title}
									</button>
								))}
							</div>
							<label>Farbe</label>
							<div className="flex space-x-4 p-4 justify-between">
								{options.map((option) => (
									<button
										key={option.id}
										onClick={() => {
											setEditButton({
												...editButton!,
												buttonType: option.id,
											});
                      setButtons((prevButtons) => {
                        return prevButtons.map((button) =>
                          button.id === editButton?.id
                            ? {
                                ...button,
                                buttonType: option.id,
                              }
                            : button
                        );
                      })
											setSelectedOption(option.id);
										}}
										className={`p-4 rounded-lg font-bold text-white ${
											selectedOption === option.id ? "ring-4 ring-offset-2" : ""
										} ${option.style}`}
									>
										{editButton?.buttonText}
									</button>
								))}
							</div>
              <button onClick={()=>{
                setButtons((prevButtons) => {
                  return prevButtons.filter((button) => button.id !== editButton?.id);
                })
                setSteps((prevSteps) => {
                  return prevSteps.map((step) =>
                    step.id === activeStepId
                      ? {
                          ...step,
                          linksto: step.linksto?.filter((link) => link.id !== editButton?.id)
                        }
                      : step
                  );
                });
                deleteButton(editButton?.id!)
                setDialogOpen(false)
              }} className="bg-red-800 font-bold text-3xl rounded-md text-white px-2 py-4">Knopf löschen</button>
						</div>
					</DialogPanel>
				</div>
			</Dialog>
		</>
	) : (
		<div className="flex flex-col justify-center items-center min-h-screen">
			<div className="text-3xl flex flex-row items-center text-red-800 font-semibold">
				Was machst du hier!? 🤨
			</div>
		</div>
	);
}
