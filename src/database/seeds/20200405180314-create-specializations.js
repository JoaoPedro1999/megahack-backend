module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'specializations',
      [
        {
          description: 'Infectologista',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Fonoaudiólogo',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Psicólogo',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Nutricionista',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Geriatra',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Fisioterapeuta',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Quiropata',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          description: 'Dentista',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('People', null, {});
  },
};
