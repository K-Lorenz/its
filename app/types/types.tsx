import { MDXRemoteSerializeResult } from "next-mdx-remote";

export type ButtonType = "Accept" | "Cancel" | "Neutral";
export type link = {
    destinationStep: StepType;
};
export type LinkType = {
  id: string;
  destinationStepId: string; // Just store the ID
  buttonType: ButtonType;
  buttonText: string;
};

export type StepType = {
  text?: MDXRemoteSerializeResult;
  rawText: string;
  id: string;
  title: string;
  linksto?: LinkType[];
  active: boolean;
};

