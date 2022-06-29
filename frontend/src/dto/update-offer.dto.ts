
export default class UpdateOfferDto {
  public title?: string;

  public description?: string;

  public postDate?: Date;
  public type?: string;

  public price?: number;

  public bedrooms?: number;

  public goods?: string[];

  public images?: string[];
  public isPremium?: boolean;


  public locationLtd?: number;

  public locationLng?: number;

  public locationZoom?: number;

  public maxAdults?: number;

  public previewImage?: string;

  public rating?: number;

}
