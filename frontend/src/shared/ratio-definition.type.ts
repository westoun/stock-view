export interface Ratio {
  title: string;
  numeratorType: FundamentalDataType;
  denominatorType?: FundamentalDataType;
}

export interface FundamentalDataType {
  gqlKey: string;
  title: string;
}
