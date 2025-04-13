// interface Address {
//     city: string
//     state: string
//     postalCode: string
//     country: string
// }

// interface SocialMedia {
//     facebook: string
//     twitter: string
//     linkedIn: string
//     instagram: string
//     website: string
// }

interface BusinessSpaceDetail {
    _id: string;
    owner: string;
    uniqueName: string;
    legalName: string;
    tradeName: string;
    description: string;
    status: string;
    email: string;
    phoneNumber: string;
    companySize: string;
    headline: string;
    address: {
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    category: string;
    socialMedia: {
        facebook: string;
        twitter: string;
        linkedIn: string;
        instagram: string;
        website: string;
    };
    tags: string[];
    createdAt: string;
    updatedAt: string;
    businessId: string;
}

interface ApiResponse {
    user: BusinessSpaceDetail
}

export type { BusinessSpaceDetail, ApiResponse }