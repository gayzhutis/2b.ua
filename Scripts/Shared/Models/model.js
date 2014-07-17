define([
    "order!./compositeModel",
//images        
    "order!./Images/ImageModel",
    "order!./Images/ImageCollection"
], function (
    CompositeModel,
//images  
    ImagesImageModel,
    ImagesImageCollection
) {
    var Models = {
        CompositeModel : CompositeModel,
        Images: {
            ImageModel: ImagesImageModel,
            ImageCollection: ImagesImageCollection
        }
    };

    return Models;
});