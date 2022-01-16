export default (sequelize, DataTypes) => {
  const BalanceSheet = sequelize.define(
    'balance_sheet',
    {
      SimFinId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      Ticker: {
        type: DataTypes.STRING,
      },
      ReportDate: {
        type: DataTypes.STRING
      },
      FiscalYear: {
        type: DataTypes.INTEGER,
      },
      SharesBasic: {
        type: DataTypes.INTEGER,
      },
      SharesDiluted: {
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
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  BalanceSheet.associate = (models) => {
    BalanceSheet.belongsTo(models.companies, {
      foreignKey: 'SimFinId',
      targetKey: 'SimFinId',
    });
  };

  return BalanceSheet;
};
