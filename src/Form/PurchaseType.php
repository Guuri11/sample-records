<?php

namespace App\Form;

use App\Entity\Purchase;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PurchaseType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('serial_number')
            ->add('date')
            ->add('time')
            ->add('received')
            ->add('address')
            ->add('town')
            ->add('city')
            ->add('country')
            ->add('comment')
            ->add('final_price')
            ->add('created_at')
            ->add('updated_at')
            ->add('user')
            ->add('ticket')
            ->add('product')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Purchase::class,
            'csrf_protection' => false,
            'csrf_field_name' => '_token',
            // a unique key to help generate the secret token
            'csrf_token_id'   => 'purchase_item',
        ]);
    }
}
