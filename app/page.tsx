 'use client'

import Step from "./components/step"
import { useState, useRef } from "react"
import { StepProps } from "./components/step"
import InputMask from "./components/inputMask"
import { checkServerIdentity } from "tls"

export default function Home(){
  const [info, setInfo]= useState({me:"", contactName:"", contactTime:""})
  const key = useRef(0)
  const [steps, setSteps] = useState<StepProps[]>([])
  let studentecDescription = "Wir sind ein junges, motiviertes Team von Studenten des Karlsruher Instituts für Technologie. Seit 2009 führen wir erfolgreich Projekte in verschiedenen Branchen durch. Wir zeichnen uns durch unsere Flexibilität und Innovationsgeist aus und dadurch, dass wir verschiedene Studiengänge besuchen, bringen wir frisches Wissen aus den Bereichen Informatik, Maschinenbau, Elektrotechnik und mehr in jedes Projekt. Mit über 10 Jahren Erfahrung in der Softwareentwicklung, Digitalisierung, Entwicklungsideen, Prozessoptimierung und Konstruktion sind wir der ideale Partner für Ihre Herausforderungen."

  let stepList: { [key: string]: StepProps }  = {
    welcome:{
      title: "Begrüßung",
      text: `Hallo, ich heiße ${info.me} und ich rufe im Auftrag von Studentec, dem Studentischen Ingineursbüro in Karlsruhe, an. Spreche ich mit ${info.contactName}?`,
      buttons:[
        { buttonText: "Ja", buttonType: "Accept", onClick: () => addStep(stepList.correctContact)},
        { buttonText: "Nein", buttonType: "Cancel", onClick: ()=> addStep(stepList.notContact)}
      ],
      disabled: false,
      key: 0
    },
    notContact:{
      title: "Weiterleiten",
      text: `Schade, ist denn ${info.contactName} anwesend und können sie mich weiterleiten?`,
      buttons:[
        { buttonText: "Ja", buttonType: "Accept", onClick: () => addStep(stepList.correctContact)},
        { buttonText: "Nein", buttonType: "Cancel", onClick: () => addStep(stepList.newContact)}
      ],
      disabled: false,
      key: 0
    },
    newContact:{
      title: "Neue Ansprechperson",
      text: "Alles klar wären sie denn bereit kurz mit mir zu sprechen?",
      buttons:[
        { buttonText: "Ja", buttonType: "Accept", onClick: () => addStep(stepList.correctNewContact)},
        { buttonText: "Nein", buttonType: "Cancel", onClick: () => addStep(stepList.callBackGoodbye)}
      ],
      disabled: false,
      key: 0
    },
    correctContact:{
      disabled: false,
      title:"Studentec Vorstellung",
      text:`Super! Wir haben uns  ${info.contactTime} unterhalten. Ich würde aber vorschlagen, dass ich Ihnen Studentec noch einmal kurz vorstelle. \n ${studentecDescription} Haben sie eventuell Interesse an einem persönlichen Gespräch?`,
      buttons:[
        { buttonText: "Ja", buttonType: "Accept", onClick: () => addStep(stepList.emailGoodbye)},
        { buttonText: "Nein", buttonType: "Cancel", onClick: () => addStep(stepList.callBackGoodbye)}
      ],
      key: 0
    },
    correctNewContact:{
      disabled:false,
      title: "Studentec Vorstellung",
      text: `Super! Ich würde vorschlagen, dass ich kurz Studentec vorstelle. \n ${studentecDescription} Haben sie eventuell Interesse an einem persönlichen Gespräch?`,
      buttons:[
        { buttonText: "Ja", buttonType: "Accept", onClick: () => addStep(stepList.emailGoodbye)},
        { buttonText: "Nein", buttonType: "Cancel", onClick: () => addStep(stepList.emailGoodbye)},
      ],
      key: 0
    },
    emailGoodbye:{
      disabled: false,
      title: "Email",
      text: "Super! Ich melde mich bald mit einer E-Mail mit allen näheren Details. Ich freue mich auf die eventuelle Zusammenarbeit! Auf Wiederhören",
      buttons: [{ buttonText: "Auf Wiederhören", buttonType: "Accept", onClick: () => setSteps([])}],
      key: 0
    },
    callBackGoodbye:{
      disabled: false,
      title: "Rückruf",
      text: "Schade, Sind sie damit einverstanden, wenn ich Sie in 3-6 Monaten nochmal anrufe?",
      buttons: [
        { buttonText: "Ja", buttonType: "Accept", onClick: () => addStep(stepList.goodbye)},
        { buttonText: "Nein", buttonType: "Cancel", onClick: () => addStep(stepList.deleteInfo)}
      ],
      key: 0
    },
    goodbye:{
      disabled: false,
      title: "Verabschiedung",
      text: "Vielen Dank für Ihre Zeit und bis bald!",
      buttons: [{ buttonText: "Auf Wiederhören", buttonType: "Accept", onClick: () => setSteps([])}],
      key: 0
    },
    deleteInfo:{
      disabled: false,
      title: "Daten löschen",
      text: "Vielen Dank für Ihre Zeit. Wir werden ihre Kontaktdaten nun löschen. Auf Wiederhören",
      buttons: [
        { buttonText: "Auf Wiederhören", buttonType: "Accept", onClick: () => setSteps([])}
      ],
      key: 0
    }
  }

  function addStep(step: StepProps, disablePrevStep = true) {
    key.current += 1;
      setSteps((prevSteps) => {
        // Log the new step with its updated key
        console.log({ ...step, key: key.current });
        return [...prevSteps, { ...step, key: key.current }];
      });
  
    if (disablePrevStep) {
      disableStep(key.current - 1);
    }
  }
  
  
  
  
  function disableStep (key: number) {
    setSteps((prevStep) => {
      return prevStep.map((step) => {
        if (step.key === key) {
          return { ...step, disabled: true }
        }
        return step
      })
    })
  }
  function onSave () {
    addStep(stepList.welcome, false) 
}
  return(
    <div className="bg-gray-200 min-h-screen w-full flex flex-col items-center space-y-5">
      <h1 className="text-3xl font-semibold text-black mt-12 mb-12"> Interaktives TelefonSkript!</h1>   
      { steps.length<1 &&<InputMask setInfo={setInfo} info={info} onSave={onSave}/>}
      <div>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} text={step.text} buttons={step.buttons} disabled={step.disabled}/>
        ))}
      </div>
    </div>
  )
}