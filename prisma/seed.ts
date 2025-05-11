const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prismaClient = new PrismaClient();

async function seedUser() {
  try {
    // Définir les informations de l'utilisateur
    const userData = {
      email: 'martin.dohou@epitech.eu',
      name: 'Martin Dohou',
      password: 'password123', // Changez pour un mot de passe plus sécurisé
      image: 'https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=ffffff' // Avatar généré automatiquement
    };
    
    console.log('Hachage du mot de passe...');
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    console.log('Vérification de l\'existence de l\'utilisateur...');
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prismaClient.user.findUnique({
      where: { email: userData.email }
    });
    
    if (existingUser) {
      console.log(`L'utilisateur avec l'email ${userData.email} existe déjà.`);
      return existingUser;
    }
    
    console.log('Création de l\'utilisateur...');
    // Créer l'utilisateur
    const user = await prismaClient.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        image: userData.image
      }
    });
    
    console.log('Utilisateur créé avec succès:');
    console.log({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    });
    
    return user;
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw error;
  } finally {
    await prismaClient.$disconnect();
  }
}

// Exécuter la fonction seedUser
seedUser()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });