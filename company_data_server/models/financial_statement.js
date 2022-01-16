export default (sequelize, DataTypes) => {
  const FinancialStatement = sequelize.define(
    'financial_statement',
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

      CashCashEquivalentsShortTermInvestments: {
        type: DataTypes.INTEGER,
      },
      AccountsNotesReceivable: {
        type: DataTypes.INTEGER,
      },
      Inventories: {
        type: DataTypes.INTEGER,
      },
      TotalCurrentAssets: {
        type: DataTypes.INTEGER,
      },
      PropertyPlantEquipmentNet: {
        type: DataTypes.INTEGER,
      },
      LongTermInvestmentsReceivables: {
        type: DataTypes.INTEGER,
      },
      OtherLongTermAssets: {
        type: DataTypes.INTEGER,
      },
      TotalNoncurrentAssets: {
        type: DataTypes.INTEGER,
      },
      TotalAssets: {
        type: DataTypes.INTEGER,
      },
      PayablesAccruals: {
        type: DataTypes.INTEGER,
      },
      ShortTermDebt: {
        type: DataTypes.INTEGER,
      },
      TotalCurrentLiabilities: {
        type: DataTypes.INTEGER,
      },
      LongTermDebt: {
        type: DataTypes.INTEGER,
      },
      TotalNoncurrentLiabilities: {
        type: DataTypes.INTEGER,
      },
      TotalLiabilities: {
        type: DataTypes.INTEGER,
      },
      ShareCapitalAdditionalPaidInCapital: {
        type: DataTypes.INTEGER,
      },
      TreasuryStock: {
        type: DataTypes.INTEGER,
      },
      RetainedEarnings: {
        type: DataTypes.INTEGER,
      },
      TotalEquity: {
        type: DataTypes.INTEGER,
      },
      TotalLiabilitiesEquity: {
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

  FinancialStatement.associate = (models) => {
    FinancialStatement.belongsTo(models.companies, {
      foreignKey: 'SimFinId',
      targetKey: 'SimFinId',
    });
  };

  return FinancialStatement;
};
