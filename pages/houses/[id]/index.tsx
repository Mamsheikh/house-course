import { useRouter } from "next/router";
import { Image } from "cloudinary-react";
import { useQuery, gql } from "@apollo/client";
import Layout from "src/components/layout";
import { ShowHouseVariables, ShowHouse } from "src/generated/ShowHouse";
// import HouseNav from "src/components/houseNav";
import SingleMap from "src/components/singleMap";

const SHOW_HOUSE_QUERY = gql`
  query ShowHouse($id: String!) {
    house(id: $id) {
      id
      userId
      longitude
      latitude
      publicId
      bedrooms
      address
      image
      nearBy {
        id
        latitude
        longitude
      }
    }
  }
`;

export default function SingleHouse() {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;

  return <HouseData id={id as string} />;
}

function HouseData({ id }: { id: string }) {
  const { data, loading } = useQuery<ShowHouse, ShowHouseVariables>(
    SHOW_HOUSE_QUERY,
    {
      variables: {
        id,
      },
    }
  );
  if (loading || !data) return <Layout main={<div>Loading...</div>} />;
  if (!data)
    return <Layout main={<div>Unable to load house with ID: {id}</div>} />;
  const { house } = data;
  return (
    <Layout
      main={
        <div className="sm:block md:flex">
          <div className="sm:w-full md:w-1/2 p-4">
            <h1 className="text-3xl my-2">{house?.address}</h1>
            <Image
              className="pb-2"
              cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
              publicId={house?.publicId}
              alt={house?.address}
              secure
              dpr="auto"
              quality="auto"
              width={900}
              height={Math.floor((9 / 16) * 900)}
              crop="fill"
              gravity="auto"
            />
            <p>{house?.bedrooms} bedrooms 🏠 </p>
          </div>
          <div className="sm:w-full md:w-1/2">
            {house && <SingleMap house={house} nearBy={house.nearBy} />}
          </div>
        </div>
      }
    />
  );
}
