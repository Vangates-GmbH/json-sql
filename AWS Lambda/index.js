exports.handler = async (event) => {
    try {
        // Parse the incoming request body
        //const input = JSON.parse(event.body);

        const input = event;

        // Transform the input JSON to SQL
        const sqlQuery = transformJsonToSql(input.json ? input : {json: input });

        // Return the SQL query as the response
        return {
            statusCode: 200,
            body: JSON.stringify({ sqlQuery }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Error: ${error.message}` }),
        };
    }
};

function transformJsonToSql(input) {
    try {
        let parsedInput = input.json;
        let additionalData = parsedInput[0];
        let mainData = parsedInput[1];

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
            let linkedinUrl = item.profileUrl ? `'${item.profileUrl.replace(/'/g, "\\'")}'` : 'NULL';
            let companyState = item.companyLocation ? `'${item.companyLocation.replace(/'/g, "\\'")}'` : 'NULL';
            let customerName = additionalData.customer_name ? `'${additionalData.customer_name.replace(/'/g, "\\'")}'` : 'NULL';
            let companyLocation = item.companyLocation ? `'${item.companyLocation.replace(/'/g, "\\'")}'` : 'NULL';
            let linkedinCompany = item.companyId ? `'${item.companyId.replace(/'/g, "\\'")}'` : 'NULL';
            let companyNameCleaned = item.companyId ? `'${item.companyId.replace(/'/g, "\\'")}'` : 'NULL';

            return `(${ICP_TM}, ${domain}, ${industry}, ${fullName}, ${jobTitle}, ${lastName}, ${firstName}, ${sizeRange}, ${companyName}, ${linkedinUrl}, ${companyState}, ${customerName}, ${companyLocation}, ${linkedinCompany}, ${companyNameCleaned})`;
        }).join(", ");

        let sqlQuery = `INSERT INTO URL_to_Data.URL_to_Data (ICP_TM, domain, industry, full_name, job_title, last_name, first_name, size_range, company_name, linkedin_url, company_state, customer_name, company_location, linkedin_company, company_name_cleaned) VALUES ${sqlValues};`;
        return sqlQuery;
    } catch (error) {
        return `Error: ${error.message}`;
    }
}
