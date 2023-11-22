"use server"

// not in use here, this is to be called from a client component

export async function getJobs({ url }: { url: string }) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Host": process.env.Rapid_API_Host || "",
      "X-RapidAPI-Key": process.env.RAPID_API_KEY || "",
    },
  }
  try {
    const response = await fetch(url, options)
    // how to print out the fetch request body?

    const respJSON = await response.json()
    const jobs = respJSON.data
    // console.log("debug server action getJobs results: ", jobs.data[0])
    return jobs
  } catch (error) {
    console.log(error)
  }
}

export async function getCountries() {
  const url = "https://restcountries.com/v2/all?fields=name,flag,alpha2Code"
  const options = {
    method: "GET",
  }
  try {
    const response = await fetch(url, options)
    const countries = await response.json()
    const countryNameList = countries.map((country: any) => country.name)
    // console.log("debug server action getCountries results: ", countryNameList)
    const countryFlagMap = new Map()
    countries.forEach((country: any) =>
      countryFlagMap.set(country.name, country.flag)
    )

    // console.log("debug server action getCountries results: ", countryFlagMap)

    return { countryNameList, countryFlagMap }
  } catch (error) {
    console.log(error)
    throw error
  }
}

// export async function getClientIP({ req }: NextRequest) {
//   const ip = req.ip
//   console.log("debug server action getClientIP results: ", ip)
// }
