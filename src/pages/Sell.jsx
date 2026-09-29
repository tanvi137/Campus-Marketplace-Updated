import {
  ArrowLeft,
  ImagePlus,
  Mail,
  PackagePlus,
  Save,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

const CURRENT_USER_ID = "current-user";

const categories = [
  "Books",
  "Electronics",
  "Lab Equipment",
  "Furniture",
  "Clothing",
  "Sports",
  "Accessories",
  "Other",
];

const conditions = [
  "New",
  "Like New",
  "Good",
  "Fair",
];

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_IMAGE_DIMENSION = 1200;

const wait = (milliseconds) =>
  new Promise((resolve) =>
    setTimeout(resolve, milliseconds)
  );

function Sell({ onAddProduct }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Books",
    price: "",
    condition: "Good",
    availability: "available",
    description: "",
    image: "",
    sellerName: "Tanvi",
    sellerEmail: "",
    location: "SRM Campus",
  });

  const [imageError, setImageError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isProcessingImage, setIsProcessingImage] =
    useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSubmitError("");

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();

        image.onload = () => {
          let { width, height } = image;

          if (
            width > MAX_IMAGE_DIMENSION ||
            height > MAX_IMAGE_DIMENSION
          ) {
            if (width > height) {
              height =
                (height / width) *
                MAX_IMAGE_DIMENSION;

              width = MAX_IMAGE_DIMENSION;
            } else {
              width =
                (width / height) *
                MAX_IMAGE_DIMENSION;

              height = MAX_IMAGE_DIMENSION;
            }
          }

          const canvas =
            document.createElement("canvas");

          canvas.width = Math.round(width);
          canvas.height = Math.round(height);

          const context = canvas.getContext("2d");

          if (!context) {
            reject(
              new Error(
                "Unable to process this image."
              )
            );

            return;
          }

          context.drawImage(
            image,
            0,
            0,
            canvas.width,
            canvas.height
          );

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(
                  new Error(
                    "Unable to compress this image."
                  )
                );

                return;
              }

              const compressedReader =
                new FileReader();

              compressedReader.onload = () => {
                resolve(
                  compressedReader.result
                );
              };

              compressedReader.onerror = () => {
                reject(
                  new Error(
                    "Unable to prepare the image."
                  )
                );
              };

              compressedReader.readAsDataURL(blob);
            },
            "image/jpeg",
            0.82
          );
        };

        image.onerror = () => {
          reject(
            new Error(
              "Unable to load this image."
            )
          );
        };

        image.src = reader.result;
      };

      reader.onerror = () => {
        reject(
          new Error(
            "Unable to read this image."
          )
        );
      };

      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageError("");
    setSubmitError("");
    setIsProcessingImage(true);

    if (!file.type.startsWith("image/")) {
      setImageError(
        "Please select a valid image file."
      );

      event.target.value = "";
      setIsProcessingImage(false);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(
        "Image must be smaller than 2 MB."
      );

      event.target.value = "";
      setIsProcessingImage(false);
      return;
    }

    try {
      const compressedImage =
        await compressImage(file);

      await wait(700);

      setFormData((current) => ({
        ...current,
        image: compressedImage,
      }));
    } catch (error) {
      setImageError(
        error.message ||
          "Unable to process this image."
      );

      event.target.value = "";
    } finally {
      setIsProcessingImage(false);
    }
  };

  const removeImage = () => {
    setFormData((current) => ({
      ...current,
      image: "",
    }));

    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitError("");

    const trimmedName =
      formData.name.trim();

    const trimmedDescription =
      formData.description.trim();

    const trimmedSellerName =
      formData.sellerName.trim();

    const trimmedSellerEmail =
      formData.sellerEmail.trim();

    const trimmedLocation =
      formData.location.trim();

    const price = Number(formData.price);

    if (!formData.image) {
      setImageError(
        "Please upload a product image."
      );

      return;
    }

    if (!trimmedName) {
      setSubmitError(
        "Please enter an item name."
      );

      return;
    }

    if (!formData.category) {
      setSubmitError(
        "Please select a category."
      );

      return;
    }

    if (!formData.condition) {
      setSubmitError(
        "Please select the item's condition."
      );

      return;
    }

    if (!formData.availability) {
      setSubmitError(
        "Please select the item's availability."
      );

      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setSubmitError(
        "Please enter a valid price greater than ₹0."
      );

      return;
    }

    if (trimmedDescription.length < 10) {
      setSubmitError(
        "Description should contain at least 10 characters."
      );

      return;
    }

    if (!trimmedSellerName) {
      setSubmitError(
        "Please enter your name."
      );

      return;
    }

    if (!trimmedSellerEmail) {
      setSubmitError(
        "Please enter your email address."
      );

      return;
    }

    if (!trimmedLocation) {
      setSubmitError(
        "Please enter a pickup location."
      );

      return;
    }

    const newProduct = {
      id: `prod-${Date.now()}`,
      ownerId: CURRENT_USER_ID,
      name: trimmedName,
      price,
      category: formData.category,
      condition: formData.condition,
      inStock:
        formData.availability === "available",
      description: trimmedDescription,
      image: formData.image,
      seller: {
        name: trimmedSellerName,
        email: trimmedSellerEmail,
        location: trimmedLocation,
      },
      createdAt: new Date().toISOString(),
    };

    try {
      onAddProduct(newProduct);

      navigate("/my-listings");
    } catch (error) {
      setSubmitError(
        "Unable to create the listing. Please try again."
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-transparent dark:text-slate-100">
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        {/* Back */}
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-1"
          />
          Back to marketplace
        </Link>

        {/* Header */}
        <div className="mt-8">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
            <PackagePlus size={21} />
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Seller dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Sell an item
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Create a clear and accurate listing so other
            students can quickly understand what you're
            selling.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_18px_50px_rgba(0,0,0,0.25)]"
        >
          {/* Listing information */}
          <div className="p-6 sm:p-8">
            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Listing information
              </h2>

              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                Provide accurate information about your item.
              </p>
            </div>

            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              {/* Product name */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Product name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Casio Scientific Calculator"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-500"
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Price
                </label>

                <div className="mt-2 flex overflow-hidden rounded-xl border border-slate-200 bg-white transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950">
                  <span className="flex items-center border-r border-slate-200 px-4 text-sm font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    ₹
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    required
                    className="w-full bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label
                  htmlFor="condition"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Condition
                </label>

                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500"
                >
                  {conditions.map((condition) => (
                    <option
                      key={condition}
                      value={condition}
                    >
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability */}
              <div>
                <label
                  htmlFor="availability"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Availability
                </label>

                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-500"
                >
                  <option value="available">
                    Available
                  </option>

                  <option value="out-of-stock">
                    Out of stock
                  </option>
                </select>

                <p className="mt-2 text-xs leading-5 text-slate-400 dark:text-slate-500">
                  Choose whether students can currently
                  purchase this item.
                </p>
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="description"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Description
                  </label>

                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {formData.description.length}/
                    {MAX_DESCRIPTION_LENGTH}
                  </span>
                </div>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(event) => {
                    const value =
                      event.target.value.slice(
                        0,
                        MAX_DESCRIPTION_LENGTH
                      );

                    setFormData((current) => ({
                      ...current,
                      description: value,
                    }));

                    setSubmitError("");
                  }}
                  placeholder="Describe the item's condition, usage, and anything buyers should know..."
                  rows={5}
                  required
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Product image */}
          <div className="border-t border-slate-100 p-6 dark:border-slate-800 sm:p-8">
            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Product photo
              </h2>

              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                Upload a clear photo of the item you're
                selling.
              </p>
            </div>

            <div className="mt-7">
              {isProcessingImage ? (
                <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950 sm:h-80">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950 dark:border-slate-700 dark:border-t-white" />

                  <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Processing image...
                  </p>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Optimizing your image for storage
                  </p>
                </div>
              ) : formData.image ? (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                  <img
                    src={formData.image}
                    alt="Product preview"
                    className="h-72 w-full bg-slate-100 object-contain dark:bg-slate-800 sm:h-80"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition-transform hover:scale-105 dark:bg-slate-900 dark:text-slate-200"
                    aria-label="Remove image"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-400">
                    <ImagePlus size={22} />
                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Click to upload an image
                  </p>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    PNG, JPG or WEBP · Maximum 2 MB
                  </p>

                  <input
                    ref={fileInputRef}
                    id="image"
                    name="image"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}

              {imageError && (
                <p className="mt-2 text-xs font-medium text-red-500 dark:text-red-400">
                  {imageError}
                </p>
              )}
            </div>
          </div>

          {/* Seller information */}
          <div className="border-t border-slate-100 p-6 dark:border-slate-800 sm:p-8">
            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Seller information
              </h2>

              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                Add your contact details so interested buyers
                know how to reach you.
              </p>
            </div>

            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              {/* Seller name */}
              <div>
                <label
                  htmlFor="sellerName"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Seller name
                </label>

                <input
                  id="sellerName"
                  name="sellerName"
                  type="text"
                  value={formData.sellerName}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-500"
                />
              </div>

              {/* Seller email */}
              <div>
                <label
                  htmlFor="sellerEmail"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Seller email
                </label>

                <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950">
                  <Mail
                    size={18}
                    className="shrink-0 text-slate-400 dark:text-slate-500"
                  />

                  <input
                    id="sellerEmail"
                    name="sellerEmail"
                    type="email"
                    value={formData.sellerEmail}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="location"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Pickup location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. SRM Campus"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {submitError && (
            <div className="border-t border-red-100 bg-red-50 px-6 py-4 dark:border-red-500/20 dark:bg-red-500/10 sm:px-8">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {submitError}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-950/70 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isProcessingImage}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-indigo-500 dark:hover:text-white"
            >
              <Save size={17} />

              {isProcessingImage
                ? "Processing image..."
                : "Create listing"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Sell;