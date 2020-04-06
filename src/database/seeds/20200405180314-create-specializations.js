import uuid from 'uuid/v4';

export function up(queryInterface) {
  return queryInterface.bulkInsert(
    'specializations',
    [
      {
        id: uuid(),
        description: 'Infectologista',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        description: 'Fonoaudiólogo',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        description: 'Psicólogo',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        description: 'Nutricionista',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        description: 'Geriatra',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        description: 'Fisioterapeuta',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        description: 'Quiropata',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuid(),
        description: 'Dentista',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
    {}
  );
}
export function down(queryInterface) {
  return queryInterface.bulkDelete('People', null, {});
}
