
export type PartnerType = {
    id: number,
    name: string,
    created_at: Date,
    description: string | null,
    benefit_description: string | null,
    deleted_at: string | null,
    has_image_stored: boolean,
}


class Partner {
    private id: number;
    private name: string;
    private created_at: Date;
    private description: string | null;
    private benefit_description: string | null;
    private deleted_at: string | null;
    private has_image_stored: boolean;

    constructor(patnerData: PartnerType) {
        this.id = patnerData.id
        this.name = patnerData.name
        this.created_at = patnerData.created_at
        this.description = patnerData.description
        this.benefit_description = patnerData.benefit_description
        this.deleted_at = patnerData.deleted_at
        this.has_image_stored = patnerData.has_image_stored
    }

}

export default Partner