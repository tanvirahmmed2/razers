import { pool } from "./pg";

export async function getSiteData() {
    try {
        const query = `
            SELECT 
                w.website_id, 
                w.status as website_status, 
                w.name as website_name,
                w.theme,
                w.logo,
                w.favicon,
                w.primary_color,
                w.secondary_color,
                w.is_store_enabled,
                w.business_name,
                w.email as website_email,
                w.phone as website_phone,
                w.address as website_address,
                w.meta_title,
                w.meta_description,
                w.facebook,
                w.instagram,
                w.linkedin,
                w.youtube,
                w.city,
                w.country,
                w.is_public
            FROM public.websites w
            LIMIT 1;
        `;

        const { rows } = await pool.query(query);

        if (rows.length === 0) {
            return null;
        }

        return rows[0];
    } catch (error) {
        console.error("Error fetching website details:", error);
        return null;
    }
}
