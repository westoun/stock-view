export default (sequelize, DataTypes) => {
  const Industry = sequelize.define(
    'industries',
    {
      IndustryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Sector: {
        type: DataTypes.STRING,
      },
      Industry: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  Industry.associate = models => {
    Industry.hasMany(models.companies, {
      foreignKey: 'IndustryId',
      sourceKey: 'IndustryId'
    })
  }

  return Industry;
};
