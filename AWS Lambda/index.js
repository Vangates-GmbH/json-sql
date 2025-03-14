exports.handler = async (event) => {
    try {
        // Parse the incoming request body
        //const input = JSON.parse(event.body);

        const input = event;

        // Transform the input JSON to SQL
        const sqlQuery = await transformJsonToSql(input.json ? input : {json: input });

        // Return the SQL query as plain text
        return {
            statusCode: 200,
            body: sqlQuery.toString(),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: {message: error.message, stack: error.stack}}),
        };
    }
};

async function transformJsonToSql(input) {
    let parsedInput = input.json;
    let additionalData = parsedInput[0];
    let mainData = [];

    if(additionalData.dataURL) {
        const response = await fetch(additionalData.dataURL);
        mainData = await response.json();
    } else {
        mainData = parsedInput;
    }

    let sqlValues = mainData.map(item => {
        let ICP_TM = additionalData.ICP_TM ? `'${additionalData.ICP_TM.replace(/'/g, "\\'")}'` : 'NULL';
        let domain = item.companyId ? `'${item.companyId.replace(/'/g, "\\'")}'` : 'NULL';
        let industry = item.industry ? `'${item.industry.replace(/'/g, "\\'")}'` : 'NULL';
        let fullName = item.fullName ? `'${item.fullName.replace(/'/g, "\\'")}'` : 'NULL';
        let jobTitle = item.title ? `'${item.title.replace(/'/g, "\\'")}'` : 'NULL';
        let lastName = item.lastName ? `'${item.lastName.replace(/'/g, "\\'")}'` : 'NULL';
        let firstName = item.firstName ? `'${item.firstName.replace(/'/g, "\\'")}'` : 'NULL';
        let sizeRange = item.companyId ? `'${item.companyId.replace(/'/g, "\\'")}'` : 'NULL';
        let companyName = item.companyId ? `'${item.companyId.replace(/'/g, "\\'")}'` : 'NULL';
        let linkedinUrl = item.linkedInProfileUrl ? `'${item.linkedInProfileUrl.replace(/'/g, "\\'")}'` : 'NULL';
        let companyState = item.companyLocation ? `'${item.companyLocation.replace(/'/g, "\\'")}'` : 'NULL';
        let customerName = additionalData.customer_name ? `'${additionalData.customer_name.replace(/'/g, "\\'")}'` : 'NULL';
        let companyLocation = item.companyLocation ? `'${item.companyLocation.replace(/'/g, "\\'")}'` : 'NULL';
        let linkedinCompany = item.companyId ? `'${item.companyId.replace(/'/g, "\\'")}'` : 'NULL';
        let companyNameCleaned = item.companyId ? `'${item.companyId.replace(/'/g, "\\'")}'` : 'NULL';

        return `(${ICP_TM}, ${domain}, ${industry}, ${fullName}, ${jobTitle}, ${lastName}, ${firstName}, ${sizeRange}, ${companyName}, ${linkedinUrl}, ${companyState}, ${customerName}, ${companyLocation}, ${linkedinCompany}, ${companyNameCleaned})`;
    }).join(", ");

    let sqlQuery = `INSERT INTO URL_to_Data.URL_to_Data (ICP_TM, domain, industry, full_name, job_title, last_name, first_name, size_range, company_name, linkedin_url, company_state, customer_name, company_location, linkedin_company, company_name_cleaned) VALUES ${sqlValues};`;
    return sqlQuery;
}