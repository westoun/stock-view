export default (sequelize, DataTypes) => {
  const Company = sequelize.define(
    'companies',
    {
      SimFinId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Ticker: {
        type: DataTypes.STRING,
      },
      CompanyName: {
        type: DataTypes.STRING,
      },
      IndustryId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  Company.associate = (models) => {
    Company.belongsTo(models.industries, {
      foreignKey: 'IndustryId',
      targetKey: 'IndustryId',
    });
  };

  Company.associate = (models) => {
    Company.hasMany(models.income_statement, {
      foreignKey: 'SimFinId',
      sourceKey: 'SimFinId',
    });
  };

  Company.associate = (models) => {
    Company.hasMany(models.financial_statement, {
      foreignKey: 'SimFinId',
      sourceKey: 'SimFinId',
    });
  };

  Company.associate = (models) => {
    Company.hasMany(models.balance_sheet, {
      foreignKey: 'SimFinId',
      sourceKey: 'SimFinId',
    });
  };

  Company.associate = (models) => {
    Company.hasMany(models.cashflow_statement, {
      foreignKey: 'SimFinId',
      sourceKey: 'SimFinId',
    });
  };

  return Company;
};
