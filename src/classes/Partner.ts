
export type PartnerType = {
    id: number,
    name: string,
    created_at: Date,
    description: string | null,
    benefit_description: string | null

}


class Partner {
    private id: number;
    private name: string;
    private created_at: Date;
    private description: string | null;
    private benefit_description: string | null;

    constructor(patnerData: PartnerType) {
        this.id = patnerData.id
        this.name = patnerData.name
        this.created_at = patnerData.created_at
        this.description = patnerData.description
        this.benefit_description = patnerData.benefit_description
    }

}

export default Partner