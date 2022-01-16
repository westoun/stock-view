export default (sequelize, DataTypes) => {
  const CashflowStatement = sequelize.define(
    'cashflow_statement',
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

      NetIncomeStartingLine: {
        type: DataTypes.INTEGER,
      },
      DepreciationAmortization: {
        type: DataTypes.INTEGER,
      },
      NonCashItems: {
        type: DataTypes.INTEGER,
      },
      ChangeinWorkingCapital: {
        type: DataTypes.INTEGER,
      },
      ChangeinAccountsReceivable: {
        type: DataTypes.INTEGER,
      },
      ChangeinInventories: {
        type: DataTypes.INTEGER,
      },
      ChangeinAccountsPayable: {
        type: DataTypes.INTEGER,
      },

      ChangeinOther: {
        type: DataTypes.INTEGER,
      },
      NetCashfromOperatingActivities: {
        type: DataTypes.INTEGER,
      },
      ChangeinFixedAssetsIntangibles: {
        type: DataTypes.INTEGER,
      },
      NetChangeinLongTermInvestment: {
        type: DataTypes.INTEGER,
      },
      NetCashfromAcquisitionsDivestitures: {
        type: DataTypes.INTEGER,
      },
      NetCashfromInvestingActivities: {
        type: DataTypes.INTEGER,
      },
      DividendsPaid: {
        type: DataTypes.INTEGER,
      },
      CashfromRepaymentofDebt: {
        type: DataTypes.INTEGER,
      },
      CashfromRepurchaseofEquity: {
        type: DataTypes.INTEGER,
      },
      NetCashfromFinancingActivities: {
        type: DataTypes.INTEGER,
      },
      NetChangeinCash: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  CashflowStatement.associate = (models) => {
    CashflowStatement.belongsTo(models.companies, {
      foreignKey: 'SimFinId',
      targetKey: 'SimFinId',
    });
  };

  return CashflowStatement;
};
