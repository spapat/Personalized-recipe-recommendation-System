const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./google-sheets.json');
require('dotenv').config();


const doc = new GoogleSpreadsheet('1sP3FVWIG9_BFrbZMemMNylqZEt2mIjCQcemvH3-vWkk');
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// It stores the given ingredients values individually
const storeValuesinSpreadSheet = async (ingredientsList) => {

    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });

    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);

    const sheet = doc.sheetsByIndex[0];

    // append rows
    for (i = 0; i < ingredientsList.length; i++) {
        await sheet.addRow({ ingredients: ingredientsList[i] });
    }

    const rows = await sheet.getRows(); // can pass in { limit, offset }

    // read/write row values
    console.log(rows[0].ingredients); 

    console.log(sheet.rowCount);
    return true;
}

// It fetches the given ingredients value, their title and prices from the sheets and returns it separately. 
const readSpreadSheet = async () => {
    await doc.useServiceAccountAuth({
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    });

    await doc.loadInfo();

    const sheet1 = doc.sheetsByIndex[0];
    const sheet2 = doc.sheetsByIndex[1];

    var priceList = [];
    var ingredientsList = [];
    var title = [];
    const rows1 = await sheet1.getRows();
    const rows2 = await sheet2.getRows(); 
    for (i = 0; i < rows2.length; i++) {
        priceList.push(rows2[i].price);
        ingredientsList.push(rows1[i].ingredients);
        title.push(rows2[i].ingredients);
    }

    return {
        priceList: priceList,
        ingredientsList: ingredientsList,
        title: title
    };
}

exports.storeValuesinSpreadSheet = storeValuesinSpreadSheet;
exports.readSpreadSheet = readSpreadSheet;