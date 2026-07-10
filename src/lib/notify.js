import { sileo } from "sileo";

export const notify = {
  error: (message, title = "Error") => {
    sileo.error({
      title: title,
      description: message,
    });
  },
  success: (message, title = "Éxito") => {
    sileo.success({
      title: title,
      description: message,
    });
  },
  warning: (message, title = "Advertencia") => {
    sileo.warning({
      title: title,
      description: message,
    });
  },
  info: (message, title = "Información") => {
    sileo.info({
      title: title,
      description: message,
    });
  },
  productSaved: (message) => {  
    sileo.success({
      title: "Producto guardado",
      description: message,
    });
  },
  fileUploaded: (message) => {
    sileo.success({
      title: "Archivo subido",
      description: message,
    });
  },
};