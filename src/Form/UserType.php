<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Vich\UploaderBundle\Form\Type\VichImageType;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email')
            ->add('roles', ChoiceType::class,
                [ 'choices'  => [
                    'Usuari normal' => 'ROLE_USER',
                    'Admnistrador' => 'ROLE_ADMIN'
                ],
                    'multiple'=>true,
                    'expanded'=>true
                ])
            ->add('password')
            ->add('name')
            ->add('surname')
            ->add('address')
            ->add('postal_code')
            ->add('town')
            ->add('city')
            ->add('phone')
            ->add('credit_card')
            ->add('created_at')
            ->add('updated_at')
            ->add('profileFile', VichImageType::class, [
                'required' => false,
                'allow_delete' => true,
                'download_uri' => true,
                'image_uri' => true,
                'asset_helper' => true,
                'imagine_pattern' => 'my_thumb'
            ])
            ->add('headerFile', VichImageType::class, [
                'required' => false,
                'allow_delete' => true,
                'download_uri' => true,
                'image_uri' => true,
                'asset_helper' => true,
                'imagine_pattern' => 'my_thumb'
            ])

        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
