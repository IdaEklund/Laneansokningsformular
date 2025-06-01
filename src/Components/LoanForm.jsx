import "./LoanFormStyle.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


export default function LoanForm(){


    //Innan jag la till det här Yup-valideringsschemat så hade jag använt mig av
    //useState och skapat ett objekt där jag sparade formulärvärdena.
    //Formulärvärdena sparades med hjälp av en event-handler när man klickade på 
    //"skicka"-knappen.
    //Yup-valideringsschemat fungerar på ett annat sätt, därför tog jag bort det
    //skapade objektet.
    const validationSchema = yup.object().shape({
        //Varje "input" har sina egna regler på vad användare måste fylla i.
        //Om användaren inte fyller i fälten rätt så dyker felmeddelanden upp.
        name: yup.string().required("Vänligen fyll i ditt namn!"),
        phone: yup
          .string("9-12 tecken")
          .trim()
          .min(9, "Telefonnumret måste vara 9-12 tecken långt!")
          .max(12)
          .required("Vänligen fyll i ditt telefonnummer!"),
        age: yup
          .number()
          .typeError("Skriv din ålder med en siffra!")
          .min(18, "Du måste vara minst 18 år.")
          .integer("Ålder måste vara ett heltal!")
          .required("Vänligen fyll i din ålder!"),
        employment: yup.boolean(),
        salary: yup.string(),
        loanSum: yup.number().typeError("Skriv in lånesumman med siffror!"),
        purpose: yup.string().max(70, "Max 70 tecken!"),
        payBack: yup.number().typeError("Skriv in antal år som ett heltal!").max(50).integer(),
        comments: yup.string().max(70, "Max 70 tecken!"),
    });

      //Med hjälp av useForm hämtas funktioner och värden som behövs för
      //att hantera formuläret.
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    //När man klickar på "Skicka"-knappen körs nedanstående funktion
    //som tar emot formulärdatan som användaren har angett.
    const submitLoanForm = (data) => {
    //Loggar ut formulärdatan i konsollen.
    console.log(data);
    //Sparar datan som ett objekt i local storage.
    localStorage.setItem("formInput", JSON.stringify(data));
    //Ett alert-meddelande poppar up när man klickar på knappen.
    alert("Tack för din ansökan!");
    //Rensar formuläret när datan skickats in
    reset();
};

//useState används för att hålla koll på om "salaryWarning" ska
//visas eller inte.
const [salaryWarning, setSalaryWarning] = useState("");

//"watch" (en useForm-funktion) övervakar ändringar i "salary".
const salary = watch("salary");

//Med hjälp av useEffect så körs nedanstående kod om salary-värdet ändras.
useEffect(() => {
    //Varningen visas om användaren väljer "Mindre än $500".
    if (salary === "Mindre än $500") {
    setSalaryWarning("Observera: Lägre lön kan påverka din ansökan");
    } else {
    setSalaryWarning("");
    }
}, [salary]);


return (
  //Ett formulär i en grid-container.
  <div className="form-box">
    <form id="loan-form" onSubmit={handleSubmit(submitLoanForm)}>
      <fieldset className="field">
        <legend>Låneansökningsformulär</legend>

        <div className="grid-container">
          <div className="input-1">
            <label htmlFor="nameInput">Namn:</label>
            <input {...register("name")} id="nameInput" />
            <p id="error-1">{errors.name?.message}</p>
          </div>

          <div className="input-2">
            <label htmlFor="phoneInput">Telefonnummer:</label>
            <input {...register("phone")} id="phoneInput" />
            <p>{errors.phone?.message}</p>
          </div>

          <div className="input-3">
            <label htmlFor="age">Ålder:</label>
            <input {...register("age")} id="age" />
            <p>{errors.age?.message}</p>
          </div>

          <div className="input-4">
            <label htmlFor="employmentInput">Är du anställd?:</label>
            <input
              type="checkbox"
              {...register("employment")}
              id="employmentInput"
            />
            <p>{errors.employment?.message}</p>
          </div>

          <div className="input-5">
            <label htmlFor="salaryInput">Lön:</label>
            <select {...register("salary")} id="salaryInput" defaultValue={""}>
              <option value="" disabled hidden>
                Välj ett alternativ
              </option>
              <option value={"Mindre än $500"}>Mindre än $500</option>
              <option value={"$500 - $1000"}>$500 - $1000</option>
              <option value={"$1000 - $2000"}>$1000 - $2000</option>
              <option value={"Över $2000"}>Över $2000</option>
            </select>
            <p>{salaryWarning}</p>
          </div>

          <div className="input-6">
            <label htmlFor="loansumInput">Lånebelopp:</label>
            <input {...register("loanSum")} id="loansumInput" />
            <p>{errors.loanSum?.message}</p>
          </div>

          <div className="input-7">
            <label htmlFor="purposeInput">Beskriv ditt syfte med lånet:</label>
            <textarea
              {...register("purpose")}
              id="purposeInput"
              rows="3"
              cols="30"
            ></textarea>
            <p>{errors.purpose?.message}</p>
          </div>

          <div className="input-8">
            <label htmlFor="paybackInput">Återbetalningstid i år:</label>
            <input {...register("payBack")} type="number" id="paybackInput" />
            <p>{errors.payBack?.message}</p>
          </div>

          <div className="input-9">
            <label htmlFor="commentsInput">Något du vill tillägga?:</label>
            <textarea
              {...register("comments")}
              id="commentsInput"
              rows="3"
              cols="30"
            ></textarea>
            <p>{errors.comments?.message}</p>
          </div>
        </div>

        <div className="btn-container">
          <button type="submit">Skicka</button>
        </div>
      </fieldset>
    </form>
  </div>
);
}


