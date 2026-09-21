import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryFilter = searchParams.get("category");
    const countryFilter = searchParams.get("country");
    const search = searchParams.get("search");

    let query = supabase.from("channels").select(`
      *,
      channel_backups (*)
    `);

    if (categoryFilter && categoryFilter !== "All") {
      query = query.eq("category", categoryFilter);
    }

    if (countryFilter && countryFilter !== "All") {
      query = query.eq("country", countryFilter);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data: channels, error } = await query.order("priority", { ascending: false }).limit(100);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Dynamic Category Grouping
    const categoriesMap: Record<string, any[]> = {};

    channels?.forEach((ch) => {
      const cat = ch.category || "General";
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = [];
      }
      categoriesMap[cat].push(ch);
    });

    const categoryGroups = Object.keys(categoriesMap).map((catName) => ({
      name: catName,
      channels: categoriesMap[catName],
    }));

    return NextResponse.json({
      success: true,
      totalChannels: channels?.length || 0,
      categories: categoryGroups,
      channels: channels || [],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
