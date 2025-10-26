
export type ProjectManagementSuccessStory = {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    imageId?: string;
    category?: string;
    datePublished?: string;
};

export type InvestmentProject = {
    id: string;
    name: string;
    description: string;
    imageUrl?: string;
    imageId?: string;
    investmentValue: number;
    startDate: string;
};

export type RealEstateListing = {
    id: string;
    address: string;
    description: string;
    price: number;
    imageUrl?: string;
    imageId?: string;
    propertyType: string;
};

export type PhilanthropicActivity = {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    imageId?: string;
    date: string;
    goal: number;
    raised: number;
};
