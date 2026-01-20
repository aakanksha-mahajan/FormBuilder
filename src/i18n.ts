import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // Optional: can be left mostly empty since we use defaultValue
    },
  },
  es: {
    translation: {
      form: {
        title: "Verificación KYC del usuario",
        subtitle:
          "Complete el formulario KYC. Todos los campos obligatorios deben rellenarse.",
      },
      fields: {
        fullName: {
          label: "Nombre completo",
          placeholder: "Introduzca su nombre completo",
        },
        email: {
          label: "Correo electrónico",
          placeholder: "Introduzca su correo electrónico",
        },
        gender: {
          label: "Género",
          options: {
            M: "Masculino",
            F: "Femenino",
            O: "Otro",
          },
        },
        startTime: { label: "Hora de inicio" },
        stopTime: { label: "Hora de finalización" },
        calculatedTime: {
          label: "Duración calculada",
          placeholder: "La diferencia de tiempo aparecerá aquí",
        },
        testResult: {
          label: "Resultado de la prueba",
          options: {
            pass: "Aprobado",
            fail: "Reprobado",
          },
        },
        agreeTerms: {
          label: "Acepto los Términos y Condiciones",
        },
        identityProof: {
          label: "Subir documento de identidad",
        },
      },
      buttons: {
        SAVE_DRAFT: "Guardar borrador",
        SUBMIT: "Enviar",
      },
      file: {
        uploadPrompt: "Haga clic aquí para subir el archivo",
      },
      instructions: {
        kycText:
          "Complete el formulario KYC. Todos los campos obligatorios deben rellenarse.",
        guidelines: "Ver directrices de KYC",
      },
      responses: {
        success: "¡KYC enviado correctamente!",
      },
      dialog: {
        failureTitle: "Error al enviar",
        failureMessage:
          "Se produjo un error al enviar el formulario. Inténtelo de nuevo más tarde.",
      },
      // Error messages keyed by English text (so we can translate validation)
      "Name should contain only alphabets and spaces":
        "El nombre solo debe contener letras y espacios.",
      "Enter a valid email address":
        "Introduzca una dirección de correo válida.",
      "Please select a gender": "Seleccione un género.",
      "Please select a test result": "Seleccione un resultado de prueba.",
      "You must agree before submitting":
        "Debe aceptar antes de enviar.",
      "Upload a valid ID proof (PDF/JPG/PNG, max 5MB)":
        "Suba un documento de identidad válido (PDF/JPG/PNG, máx. 5MB).",
      "This field is required": "Este campo es obligatorio",
      "Invalid format": "Formato no válido",
      "Invalid time": "Hora no válida",
      "Invalid time format": "Formato de hora no válido",
      "Minimum 3 characters required": "Se requieren al menos 3 caracteres",
      "Maximum 50 characters allowed": "Se permiten como máximo 50 caracteres",
      "This must be checked": "Debe seleccionar esta opción",
      "There was an error submitting the form. Please try again later.":
        "Se produjo un error al enviar el formulario. Inténtelo de nuevo más tarde.",
      "KYC submitted successfully!": "¡KYC enviado correctamente!",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "es"],
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

