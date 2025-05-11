export async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "satcap-ocean")

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Échec du téléchargement de l'image: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
    }
  } catch (error) {
    console.error("Erreur lors du téléchargement de l'image:", error)
    throw error
  }
}

export async function deleteImage(publicId: string) {
  try {
    const response = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    })

    if (!response.ok) {
      throw new Error("Échec de la suppression de l'image")
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error)
    throw error
  }
}

export async function getStorageStats() {
  try {
    const response = await fetch("/api/cloudinary/stats", {
      method: "GET",
    })

    if (!response.ok) {
      throw new Error("Échec de la récupération des statistiques de stockage")
    }

    return await response.json()
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques de stockage:", error)
    throw error
  }
}
