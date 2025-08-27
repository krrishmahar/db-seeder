import { PrismaClient } from '../lib/generated/prisma/index.js';
import { faker } from '@faker-js/faker';
import { 
  capitalize, 
  generatePhone, 
  generateLabImageUrl, 
  randomCollectionTypes, 
  randomTestType, 
  generateTimeSlots 
} from './helper.ts';

type UserRole = 'LAB' | 'PATIENT';
type Session = 'MORNING' | 'AFTERNOON' | 'EVENING';

const prisma = new PrismaClient();

async function main() {
  const count = parseInt(process.argv[2] || '1', 10); // default 1 if not provided

  try {
    console.log('Starting seeding process...');

    // LAB USERS
    const labUsers = await Promise.all(
      Array.from({ length: count }).map(async () => {
        const role: UserRole = 'LAB';
        const firstName = capitalize(faker.person.firstName());
        const lastName = capitalize(faker.person.lastName());

        const user = await prisma.user.create({
          data: {
            email: faker.internet.email({ firstName, lastName }),
            firstName,
            lastName,
            phone: generatePhone(),
            role,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        const lab = await prisma.lab.create({
          data: {
            userId: user.id,
            labLocation: faker.location.streetAddress(),
            nablCertificateNumber: faker.string.alphanumeric(10),
            certificateUrl: faker.internet.url(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        const { category, test } = randomTestType();
        const labName = capitalize(faker.company.name());

        const labDetails = await prisma.labDetails.create({
          data: {
            labId: lab.id,
            labName,
            collectionTypes: randomCollectionTypes(),
            experienceYears: faker.number.int({ min: 1, max: 20 }),
            imageUrl: generateLabImageUrl(labName),
            isLoved: faker.datatype.boolean(),
            latitude: parseFloat(faker.location.latitude().toFixed(6)),
            longitude: parseFloat(faker.location.longitude().toFixed(6)),
            nextAvailable: faker.date.soon(), // formatted datetime
            isAvailable: faker.datatype.boolean(),
            rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
            testType: `${category} - ${test}`, // category + specific test
          },
        });

        // Multiple random time slots
        const timeSlots = await prisma.labTimeSlot.createMany({
          data: generateTimeSlots().map((slot) => ({
            ...slot,
            labId: lab.id,
            session: slot.session as Session,
          })),
        });

        return { user, lab, labDetails, timeSlots };
      })
    );

    console.log(`Created lab users-\n ${JSON.stringify(labUsers, null, 3)}`);

    // PATIENT USERS
    const patientUsers = await Promise.all(
      Array.from({ length: count }).map(async () => {
        const role: UserRole = 'PATIENT';
        const firstName = capitalize(faker.person.firstName());
        const lastName = capitalize(faker.person.lastName());

        const user = await prisma.user.create({
          data: {
            email: faker.internet.email({ firstName, lastName }),
            firstName,
            lastName,
            phone: generatePhone(),
            role,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        const patient = await prisma.patient.create({
          data: {
            userId: user.id,
            address: faker.location.streetAddress(),
            dateOfBirth: faker.date.birthdate(), // formatted date
            gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
            latitude: parseFloat(faker.location.latitude().toFixed(6)),
            longitude: parseFloat(faker.location.longitude().toFixed(6)),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        return { user, patient };
      })
    );

    console.log('Seeding completed:', { labUsers, patientUsers });
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(async (e) => {
  console.error('Seeding failed:', e);
  await prisma.$disconnect();
  process.exit(1);
});
