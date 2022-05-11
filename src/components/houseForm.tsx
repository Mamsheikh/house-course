import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { Image } from "cloudinary-react";
import { SearchBox } from "./searchBox";
import { CreateImageSignature } from "src/generated/CreateImageSignature";
// import {
//   CreateHouseMutation,
//   CreateHouseMutationVariables,
// } from "src/generated/CreateHouseMutation";
// import {
//   UpdateHouseMutation,
//   UpdateHouseMutationVariables,
// } from "src/generated/UpdateHouseMutation";

interface IFormData {
  address: string;
  latitude: number;
  longitude: number;
  bedrooms: string;
  image: FileList;
}

const SIGNATURE_MUTATION = gql`
  mutation CreateImageSignature {
    createImageSignature {
      timestamp
      signature
    }
  }
`;

interface IUploadImageResponse {
  secure_url: string;
}

const uploadImage = async (
  image: File,
  signature: string,
  timestamp: number
): Promise<IUploadImageResponse> => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append("file", image);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY ?? "");

  const response = await fetch(url, {
    method: "post",
    body: formData,
  });

  return response.json();
};

interface IProps {}

export default function HouseForm({}: IProps) {
  const [previewImage, setPreviewImage] = useState("");
  const [submiting, setSubmiting] = useState(false);
  const { register, handleSubmit, setValue, errors, watch } = useForm<
    IFormData
  >({ defaultValues: {} });

  const address = watch("address");
  const [createImageSignature] = useMutation<CreateImageSignature>(
    SIGNATURE_MUTATION
  );

  useEffect(() => {
    register({ name: "address" }, { required: "Please enter your address" });
    register({ name: "latitude" }, { required: true, min: -90, max: 90 });
    register({ name: "longitude" }, { required: true, min: -180, max: 180 });
  }, [register]);

  const handleCreate = async (data: IFormData) => {
    const { data: signatureData } = await createImageSignature();
    if (signatureData) {
      const { signature, timestamp } = signatureData.createImageSignature;
      const imageData = await uploadImage(data.image[0], signature, timestamp);
      // const imageURL = imageData.secure_url
    }
  };

  const onSubmit = (data: IFormData) => {
    setSubmiting(true);
    handleCreate(data);
  };

  return (
    <form className="mx-auto  max-w-xl py-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl">Add a new House</h1>
      <div className="mt-4">
        <label htmlFor="search" className="block">
          Search for you address
        </label>
        {/* SEARCH FIELD */}
        <SearchBox
          onSelecteAddress={(address, latitude, longitude) => {
            setValue("address", address);
            setValue("latitude", latitude);
            setValue("longitude", longitude);
          }}
          defaultValue=""
        />
        {errors.address && (
          <p className="text-red-500">{errors.address.message}</p>
        )}
      </div>
      {address && (
        <>
          <div className="mt-4">
            <label
              htmlFor="image"
              className="p-4 border-dashed border-4 border-gray-600 block cursor-pointer"
            >
              Click to add image (16:9)
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={register({
                validate: (fileList: FileList) => {
                  if (fileList.length === 1) return true;
                  return "Please upload one file";
                },
              })}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event?.target?.files?.[0]) {
                  const file = event.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {previewImage && (
              <img
                src={previewImage}
                className="mt-4 object-cover"
                style={{ width: "576px", height: `${(9 / 16) * 576}px` }}
              />
            )}
            {errors.image && (
              <p className="text-red-500">{errors.image.message}</p>
            )}
          </div>
          <div className="mt-4">
            <label htmlFor="bedrooms" className="block">
              Beds
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              className="p-2"
              ref={register({
                required: "Please enter the number of bedrooms",
                max: { value: 10, message: "Woah, too big of a house" },
                min: { value: 1, message: "must have atleast 1 bedroom" },
              })}
            />
            {errors.bedrooms && (
              <p className="text-red-500">{errors.bedrooms.message}</p>
            )}
          </div>

          <div className="mt-4">
            <button
              className="mr-4 bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
              type="submit"
              disabled={submiting}
            >
              Save
            </button>
            <Link href="/">Cancel</Link>
          </div>
        </>
      )}
    </form>
  );
}
