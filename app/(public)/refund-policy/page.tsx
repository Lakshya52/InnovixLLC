import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-(--bg-dark) text-(--text-main) pt-20 mt-[15dvh] pb-20 px-6">
      <div className="w-[80dvw] mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-(--accent) to-emerald-400 bg-clip-text text-transparent">
          Return / Refund Policy
        </h1>
        <p className="text-(--text-dim) mb-8">Last Updated: April 27, 2026</p> <br />
        <p>We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.</p> <br />
        <p>
          To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You'll also need the receipt or proof of purchase.
        </p> <br />
        <p>
          To start a return, you can contact us at info@innovixllc.com. Please note that returns will need to be sent to the following address:
        </p> <br />
        <p>
          117 S Lexington St Ste 100, Harrisonville, MO, 64701-2444, United States
        </p>
        <p> <br />
          If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted. Please note that if your country of residence is not United States, shipping your goods may take longer than expected.
        </p> <br />
        <p>
          You can always contact us for any return questions at info@innovixllc.com.
        </p> <br />

        <section className="space-y-8 text-sm md:text-base leading-relaxed text-(--text-main)/80">
          <div>
            <h2 className="text-2xl font-semibold text-(--text-main) mb-4">1. Damages and issues</h2>
            <p>
              Please inspect your order upon receipt and contact us immediately if the item is defective, damaged, or if you receive the wrong item, so that we may evaluate the issue and make it right.
            </p> <br />
            <p>
              Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.
            </p> <br />
            <p>
              Unfortunately, we cannot accept returns on sale items or gift cards.
            </p> <br />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-(--text-main) mb-4">2. Exchanges</h2>
            <p>The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.</p> <br />
            <p>European Union 3 day cooling off period</p> <br />
            <p>Notwithstanding the above, if merchandise is being shipped into the European Union, you have the right to cancel or return your order within 3 days for any reason and without justification. As above, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.</p> <br />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-(--text-main) mb-4">3. Refunds</h2>
            <p>We will notify you once we’ve received and inspected your return to let you know if the refund was approved or not. If approved, you’ll be automatically refunded on your original payment method within 10 business days. Please remember it can take some time for your bank or credit card company to process and post the refund too.</p> <br />
            <p>If more than 15 business days have passed since we’ve approved your return, please contact us at info@innovixllc.com.</p> <br />
          </div>

        </section>
      </div>
    </div>
  );
}
