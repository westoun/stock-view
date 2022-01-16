export default (sequelize, DataTypes) => {
  const IncomeStatement = sequelize.define(
    'income_statement',
    {
      SimFinId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Ticker: {
        type: DataTypes.STRING,
      },
      FiscalYear: {
        type: DataTypes.INTEGER,
      },
      ReportDate: {
        type: DataTypes.STRING
      },
      SharesBasic: {
        type: DataTypes.INTEGER,
      },
      SharesDiluted: {
        type: DataTypes.INTEGER,
      },
      Revenue: {
        type: DataTypes.INTEGER,
      },
      CostofRevenue: {
        type: DataTypes.INTEGER,
      },
      GrossProfit: {
        type: DataTypes.INTEGER,
      },
      OperatingExpenses: {
        type: DataTypes.INTEGER,
      },
      SellingGeneralAdministrative: {
        type: DataTypes.INTEGER,
      },
      ResearchDevelopment: {
        type: DataTypes.INTEGER,
      },
      DepreciationAmortization: {
        type: DataTypes.INTEGER,
      },
      OperatingIncomeLoss: {
        type: DataTypes.INTEGER,
      },
      NonOperatingIncomeLoss: {
        type: DataTypes.INTEGER,
      },
      InterestExpenseNet: {
        type: DataTypes.INTEGER,
      },
      PretaxIncomeLossAdj: {
        type: DataTypes.INTEGER,
      },
      AbnormalGainsLosses: {
        type: DataTypes.INTEGER,
      },
      PretaxIncomeLoss: {
        type: DataTypes.INTEGER,
      },
      IncomeTaxExpenseBenefitNet: {
        type: DataTypes.INTEGER,
      },
      IncomeLossfromContinuingOperations: {
        type: DataTypes.INTEGER,
      },
      NetExtraordinaryGainsLosses: {
        type: DataTypes.INTEGER,
      },
      NetIncome: {
        type: DataTypes.INTEGER,
      },
      NetIncomeCommon: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  IncomeStatement.associate = (models) => {
    IncomeStatement.belongsTo(models.companies, {
      foreignKey: 'SimFinId',
      targetKey: 'SimFinId',
    });
  };

  return IncomeStatement;
};
