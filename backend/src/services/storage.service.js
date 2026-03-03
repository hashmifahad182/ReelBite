const Imagekit = require("imagekit");
require('dotenv').config();

const imageKit = new Imagekit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(file,filename){
    const result=await imageKit.upload({
        file: file,
        fileName: filename
    })

    return result;
}

module.exports={
    uploadFile
};
