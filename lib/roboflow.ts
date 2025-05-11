import axios from "axios";

interface RoboflowPrediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class: string;
  class_id: number;
  detection_id: string;
  parent_id: string;
}

interface RoboflowResponse {
  outputs: [
    {
      output_image: {
        type: string;
        value: string;
        video_metadata: {
          video_identifier: string;
          frame_number: number;
          frame_timestamp: string;
          fps: number;
          measured_fps: null | number;
          comes_from_video_file: null | boolean;
        };
      };
      predictions: {
        image: {
          width: number;
          height: number;
        };
        predictions: RoboflowPrediction[];
      };
    }
  ];
}

export async function detectObjects(imageUrl: string) {
  try {
    // Appel à notre API interne qui gère l'authentification et l'enregistrement en base de données
    const response = await fetch("/api/detection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Échec de la détection d'objets");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la détection d'objets:", error);
    throw error;
  }
}

// Cette fonction peut être utilisée directement côté serveur
export async function callRoboflowWorkflow(
  imageUrl: string
): Promise<RoboflowResponse> {
  try {
    const roboflowApiKey = process.env.ROBOFLOW_API_KEY;

    if (!roboflowApiKey) {
      throw new Error("Clé API Roboflow non configurée");
    }

    // Appeler l'API Workflow de Roboflow avec la nouvelle URL
    const response = await axios.post(
      "https://serverless.roboflow.com/infer/workflows/cosmolab/satcap-ocean",
      {
        api_key: roboflowApiKey,
        inputs: {
          image: { type: "url", value: imageUrl },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'appel au workflow Roboflow:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Erreur Roboflow: ${error.response.status} - ${
          error.response.data.message || error.message
        }`
      );
    }
    throw error;
  }
}

// Fonction pour convertir une image base64 en URL Blob
export function base64ToBlob(base64: string, contentType = "image/jpeg"): Blob {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}
