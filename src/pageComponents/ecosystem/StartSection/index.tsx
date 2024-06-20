import CommonStartSection from "@/components/CommonStartSection";

export default function StartSection() {
  return (
    <CommonStartSection
      title="Be part of tomorrow with aelf"
      description="Start building on aelf today and realise your vision for tomorrow."
      buttonList={[
        {
          text: "Start Building",
        },
        {
          text: "Read Docs",
        },
      ]}
    />
  );
}
