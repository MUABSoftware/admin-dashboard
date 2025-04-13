interface BusinessSpace {
    businessId: string;
    category: string;
    country: string;
    createdAt: string;
    licenseId: string;
    name: string;
    status: string;
    updatedAt: string;
    legalName: string;
    tradeName: string;
    contactEmail: string;
    address: {
      city: string;
      country: string;
    };
    user: string;
    __v: number;
    _id: string;
  }
  
  interface BusinessSpacesState {
    businessSpaces: BusinessSpace[];
  }

  export type { BusinessSpace, BusinessSpacesState };