import { PrismaClient } from '../lib/generated/prisma/index.js';
import { faker } from '@faker-js/faker';

type UserRole = 'LAB' | 'PATIENT';
type Session = 'MORNING' | 'AFTERNOON' | 'EVENING';

const prisma = new PrismaClient();

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}



async function seed() {
  try {
    console.log('Starting seeding process...');

    // Seed Users and Labs
    console.log('Seeding lab users...');
    const labUsers = await Promise.all(
      Array.from({ length: 5 }).map(async () => {
        const role: UserRole = 'LAB';
        const userData = {
          email: faker.internet.email(),
          firstName: capitalize(faker.person.firstName()),
          lastName: capitalize(faker.person.lastName()),
          phone: faker.phone.number(),
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        console.log('Creating lab user:', userData);
        const user = await prisma.user.create({ data: userData });

        const labData = {
          userId: user.id,
          labLocation: faker.location.streetAddress(),
          nablCertificateNumber: faker.string.alphanumeric(10),
          certificateUrl: faker.internet.url(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        console.log('Creating lab:', labData);
        const lab = await prisma.lab.create({ data: labData });

        const labDetailsData = {
          labId: lab.id,
          labName: capitalize(faker.company.name()),
          collectionTypes: ['Blood', 'Urine', 'Saliva', 'CBC', 'MRI'],
          experienceYears: faker.number.int({ min: 1, max: 20 }),
          imageUrl: faker.image.url(),
          isLoved: faker.datatype.boolean(),
          latitude: parseFloat(faker.location.latitude().toFixed(6)),
          longitude: parseFloat(faker.location.longitude().toFixed(6)),
          nextAvailable: faker.date.soon(),
          isAvailable: true,
          rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
          testType: faker.helpers.arrayElement(['Pathology', 'Radiology', 'Urine Tests']),
        };
        console.log('Creating lab details:', labDetailsData);
        const labDetails = await prisma.labDetails.create({ data: labDetailsData });

        const timeSlots: { time: string; session: Session }[] = [
          { time: '09:00', session: 'MORNING' },
          { time: '12:00', session: 'AFTERNOON' },
          { time: '15:00', session: 'EVENING' },
          { time: '18:00', session: 'AFTERNOON' },
        ];

        console.log('Creating time slots for lab:', lab.id);
        await prisma.labTimeSlot.createMany({
          data: timeSlots.map((slot) => ({
            labId: lab.id,
            time: slot.time,
            session: slot.session,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        });

        return { user, lab, labDetails };
      })
    );

    // Seed Patients (optional)
    console.log('Seeding patient users...');
    const patientUsers = await Promise.all(
      Array.from({ length: 5 }).map(async () => {
        const role: UserRole = 'PATIENT';
        const userData = {
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          phone: faker.phone.number(),
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        console.log('Creating patient user:', userData);
        const user = await prisma.user.create({ data: userData });

        const patientData = {
          userId: user.id,
          address: faker.location.streetAddress(),
          dateOfBirth: faker.date.birthdate(),
          gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
          latitude: parseFloat(faker.location.latitude().toFixed(6)),
          longitude: parseFloat(faker.location.longitude().toFixed(6)),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        console.log('Creating patient:', patientData);
        const patient = await prisma.patient.create({ data: patientData });

        return { user, patient };
      })
    );

    console.log('Seeding completed:', { labUsers, patientUsers });
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('Prisma client disconnected');
  }
}

seed()
  .then(async() => {
    console.log('Seeding completed successfully');
    console.log('Disconnecting Prisma client...');
    await prisma.$disconnect();
  })
  .catch(async(e) => {
    console.error('Seeding failed:', e);
    await prisma.$disconnect();
    // process.exit(1);
  });