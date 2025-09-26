const BASE_URL = "http://192.168.241.56:8000/api"; // your PC IPv4

export async function createReport(reportData) {
  try {
    const response = await fetch(`${BASE_URL}/reports/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    });

    if (!response.ok) {
      throw new Error("Failed to create report");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export async function getReports() {
  try {
    const response = await fetch(`${BASE_URL}/reports/`);
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
